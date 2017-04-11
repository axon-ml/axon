from flask import Flask, request, Response

import json
import logging
import types
from functools import wraps

from axon.web import asserts

class ImmutableDict(object):
    def __init__(self, d):
        asserts.typeis(d, dict)
        self._d = d
        self.__getitem__ = self.__getattr__ = d.__getitem__

    def __getitem__(self, key):
        if key not in self._d:
            raise KeyError("Bad Key: '{}'".format(key))
        return self._d[key]

    def __getattr__(self, key):
        if key not in self._d:
            raise AttributeError("Bad attribute: '{}'".format(key))
        return self._d[key]

    def json(self):
        return json.dumps(self._d)

class Type(object):
    def __init__(self, typespec):
        asserts.typeis(typespec, dict)

        self.spec = typespec

    def __check_keys_and_types(self, values):
        asserts.typeis(values, dict)

        # Check that keysets overlap exactly
        keyset_spec = set(self.spec.keys())
        keyset_vals = set(values.keys())

        if keyset_spec != keyset_vals:
            raise ValueError("Expected dict with keyset {}, got {}".format(keyset_spec, keyset_vals))

        # Ensure types are correct for possible key
        # We continue looking for all type differences so we can report them all.
        diffs = []
        for key, val in values.items():
            if type(val) != self.spec[key]:
                diffs.append({"key": key, "expected": self.spec[key], "actual": type(val), "value": val})
        if len(diffs) > 0:
            raise ValueError(diffs)

    def __call__(self, *args, **kwargs):
        """Binds values for the spec, returning an immutable dictionary after type checking has been performed."""

        if len(args) > 0 and len(kwargs) > 0:
            raise ValueError("Cannot pass dict and use keyword args.")
        if len(args) == 0:
            values = kwargs
        else:
            values = args[0]
        self.__check_keys_and_types(values)

        return ImmutableDict(values)

class ServiceRegistry(object):
    """Services are HTTP services that can receive JSON requests and send JSON replies.

    Every service that you add to your application is a JSON service that is accessed via a POST request.
    This is not quite a RESTful API, not quite JSON-RPC either. It's basically just a really convenient way for
    defining a "typed" JSON messaging interface.

    # Define a service registry
    registry = ServiceRegistry("MyRegistry")

    @registry.register("addPerson")
    class PersonService:
        RequestType = MyServiceReq
        ResponseType = MyServiceReply

        def handle(req):
            # handles response type
            return ResponseType(name="Benjamin Button", age=23)

    registry.serve("0.0.0.0", 9090)
    """
    def __init__(self, name="DefaultRegistry"):
        self.name = name
        self.services = {}  # Blank dictionary

    def register(self, name):
        """Register a new service with the given name.
        This should be used as a decorator, see the class-level documentation in ServiceRegistry.
        """
        if name in self.services.keys():
            raise ValueError("Cannot re-register service with name {}".format(name))

        def decorator(cls):
            # Wraps a class, registering that it exists
            if cls.__dict__.get("RequestType") == None or cls.__dict__.get("ResponseType") == None:
                raise AttributeError("Class {} must define members RequestType, ResponseType at the class-level.".format(cls.__name__))
            elif not isinstance(cls.__dict__.get("RequestType"), Type):
                raise AttributeError("Request Type {} must be an instance of Type.".format(cls.__dict__.get("RequestType")))
            elif not isinstance(cls.__dict__.get("ResponseType"), Type):
                raise AttributeError("Response Type {} must be an instance of Type.".format(cls.__dict__.get("ResponseType")))
            elif cls.__dict__.get("__call__") == None or type(cls.__dict__.get("__call__")) != types.FunctionType:
                raise AttributeError("Class {} must define a method __call__(self, req) that takes an argument of type RequestType and returns ResponseType".format(cls.__name__))

            # Create an instance of the class. The class should take no arguments in the constructor.
            self.services[name] = cls()
            return cls

        return decorator

    def serve(self, host="127.0.0.1", port=9090):
        """Serve all registered services based on their identifier. See the class-level docstring for an
        example usage of this method.
        """
        # Create a Flask App and setup a multiplexer that can handle this.
        app = Flask(self.name)

        @app.route("/<path:path>", methods=["POST"])
        def multiplexer(path):
            # Make sure the incoming data is a JSON request.
            if path not in self.services:
                return Response(status=404, response="{} is not a registered service".format(path))
            if not request.is_json:
                return Response(status=415, response="mimetype should be application/json")

            # Dispatch to one of the registered services
            try:
                handler = self.services[path]
                typed_req = handler.RequestType(request.get_json())
                typed_resp = handler(typed_req)
                return Response(response=typed_resp.json(), status=200, mimetype="application/json")
            except Exception as e:
                # Serialize the exception and send back to the user.
                return Response(status=500, response=str(e))

        app.run(host, port)

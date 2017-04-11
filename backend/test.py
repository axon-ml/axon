from axon.web.core import *

import uuid

# Create a registry
registry = ServiceRegistry("SimpleService")

people = {}

@registry.register("addPerson")
class PeopleAdderService(object):
    RequestType = Type(dict(name=str, age=int))
    ResponseType = Type({"uuid": str})

    def __call__(self, req):
        global people
        uid = uuid.uuid4().hex
        people[uid] = req
        return self.ResponseType(uuid=uid)

@registry.register("getPerson")
class PeopleGetterService(object):
    RequestType = PeopleAdderService.ResponseType
    ResponseType = PeopleAdderService.RequestType

    def __call__(self, req):
        global people
        return people[req.uuid]

registry.serve()

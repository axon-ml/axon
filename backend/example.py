from axon.web.core import *

import uuid


# Types available for requests/responses
# In real code, all the Types for a particular application should go into their
# own module, and be referenced in the module defining the services.
PersonType = Type(dict(name=str, age=int))
UuidType = Type(dict(uuid=str))

class PeopleLookupService(object):
    def __init__(self):
        self.people = {}

    def add_person(self, req):
        uid = uuid.uuid4().hex
        self.people[uid] = (req.name, req.age)
        return UuidType(uuid=uid)

    def find_person(self, req):
        name, age = self.people[req.uuid]
        return PersonType(name=name, age=age)


# Our service object
personService = PeopleLookupService()

# Create a registry, and add the services we wish to expose.
registry = ServiceRegistry("PersonService")

registry.register("person/add", personService.add_person, RequestType = PersonType, ResponseType = UuidType)
registry.register("person/find", personService.find_person, RequestType = UuidType, ResponseType = PersonType)

# Finally, start serving
registry.serve("0.0.0.0", 9090)

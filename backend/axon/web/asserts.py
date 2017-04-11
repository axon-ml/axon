
def typeis(obj, expected):
    """Asserts that the object has the expected type.
    Raises a ValueError if the object true type differs.
    """
    objtype = type(obj)
    if objtype != expected:
        raise ValueError("Expected type {}, got {}".format(expected, objtype))

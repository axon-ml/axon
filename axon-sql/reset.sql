-- Drop any existing instantiation of the tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS stars CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  -- https://chartio.com/resources/tutorials/how-to-define-an-auto-increment-primary-key-in-postgresql/
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  handle VARCHAR NOT NULL,

  -- Store bcrypt'ed pw only
  pass_bcrypt VARCHAR NOT NULL,

  UNIQUE(handle)
);
-- Models table
CREATE TABLE IF NOT EXISTS models (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  owner INT NOT NULL REFERENCES users(id),
  markdown VARCHAR default 'Write markdown to describe your model here.', 

  -- model_id for parent model that this model is forked from.
  -- Can be NULL if it is not a fork.
  parent INT REFERENCES models(id),

  -- Serialized representation of the model
  repr VARCHAR,

  -- Version number for the model, so we can have model revisions
  version INT NOT NULL default 1,

  -- A user can only have one repository with a given name at a specific version
  UNIQUE (owner, name, version)
);
-- Table of stars
CREATE TABLE IF NOT EXISTS stars (
    userid INT REFERENCES users(id),
    modelid INT REFERENCES models(id),

    UNIQUE (userid, modelid)
);

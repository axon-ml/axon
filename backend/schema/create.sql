-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY,
  name VARCHAR,
  handle VARCHAR NOT NULL UNIQUE,

  -- Only store salted+hashed passwords
  pass_hash = STRING NOT NULL,
  pass_salt STRING NOT NULL
);
-- Models table
CREATE TABLE IF NOT EXISTS models (
  id INT PRIMARY KEY,
  name VARCHAR NOT NULL,
  owner INT NOT NULL FOREIGN Key (users.id)

  -- model_id for parent model that this model is forked from.
  -- Can be NULL if it is not a fork.
  parent INT FOREIGN KEY (models.id),

  -- A user can only have one repository with a given name
  UNIQUE (owner, name)
);
-- Table of stars
CREATE TABLE IF NOT EXISTS stars (
    user INT FOREIGN KEY (users.id),
    model INT FOREIGN KEY (models.id)
);

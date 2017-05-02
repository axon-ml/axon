# Axon Database Scripts

## macOS Postgres Install

```
brew update
brew install postgres
rm -rf /usr/local/var/postgres    # if you have old postgres data, put it somewhere else
initdb /usr/local/var/postgres -E utf8
brew services start postgresql
createdb
```

## DB scripts

When you want to reset the database to "factory defaults":

```
psql < reset.sql
```

Seeding it with some example data:

```
psql < seed.sql
```


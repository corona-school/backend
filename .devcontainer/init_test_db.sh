#!/bin/bash
set -e

# Note (1): password is not a secret, so this is ok
# Note (2): give default user access to the database, such that it is visible for him as well
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER coronaschool WITH PASSWORD 'coronanervt';
    CREATE DATABASE "coronaschool-test";
    GRANT ALL PRIVILEGES ON DATABASE "coronaschool-test" TO coronaschool,$POSTGRES_USER;
EOSQL
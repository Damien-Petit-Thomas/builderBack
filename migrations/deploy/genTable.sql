-- Deploy obuilder:genTable to pg

BEGIN;

CREATE TABLE IF NOT EXISTS "gen" (
id smallint PRIMARY KEY
);

COMMIT;

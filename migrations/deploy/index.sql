-- Deploy obuilder:index to pg

BEGIN;

CREATE index IF NOT EXISTS  type_idx ON type (name);


COMMIT;

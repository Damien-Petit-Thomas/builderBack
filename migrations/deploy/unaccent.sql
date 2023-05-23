-- Deploy obuilder:unaccent to pg

BEGIN;
CREATE EXTENSION IF NOT EXISTS unaccent;


COMMIT;

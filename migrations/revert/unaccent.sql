-- Revert obuilder:unaccent from pg

BEGIN;

DROP EXTENSION IF EXISTS unaccent;

COMMIT;

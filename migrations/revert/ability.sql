-- Revert obuilder:ability from pg

BEGIN;

DROP TABLE pokemon_ability CASCADE;
DROP TABLE ability CASCADE;

COMMIT;

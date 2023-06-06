-- Revert obuilder:ability from pg

BEGIN;

DROP TABLE pokemon_ability;
DROP TABLE ability;

COMMIT;

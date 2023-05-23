-- Revert obuilder:alter-insert from pg

BEGIN;

DROP FUNCTION insert_pokemon(json);
COMMIT;

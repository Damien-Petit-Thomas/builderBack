-- Revert obuilder:insert_function from pg

BEGIN;
DROP FUNCTION IF EXISTS insert_pokemon(json);
DROP FUNCTION IF EXISTS insert_type(json);
COMMIT;

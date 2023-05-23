-- Revert obuilder:add-genId from pg

BEGIN;
DROP COLUMN pokemon.gen_id;

COMMIT;

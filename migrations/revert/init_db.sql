-- Revert obuilder:init_db from pg

BEGIN;

DROP TABLE IF EXISTS "pokemon";
DROP TABLE IF EXISTS "type";

COMMIT;

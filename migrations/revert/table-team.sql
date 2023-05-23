-- Revert obuilder:table-team from pg

BEGIN;

DROP TABLE IF EXISTS "team";

COMMIT;

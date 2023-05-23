-- Revert obuilder:index from pg

BEGIN;

DROP INDEX IF EXISTS "type_idx";

COMMIT;

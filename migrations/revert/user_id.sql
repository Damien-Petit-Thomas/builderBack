-- Revert obuilder:user_id from pg

BEGIN;

ALTER TABLE "team"
    DROP COLUMN "user_id";

COMMIT;

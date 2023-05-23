-- Revert obuilder:user_table from pg

BEGIN;
DROP DOMAIN "email";
DROP TABLE "user";
COMMIT;

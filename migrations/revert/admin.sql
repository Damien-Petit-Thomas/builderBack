-- Revert obuilder:admin from pg

BEGIN;

DROP TABLE "admin";

COMMIT;

-- Deploy obuilder:user_id to pg

BEGIN;

ALTER TABLE "team"
    ADD COLUMN "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE;
COMMIT;

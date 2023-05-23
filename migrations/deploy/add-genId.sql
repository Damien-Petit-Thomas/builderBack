-- Deploy obuilder:add-genId to pg

BEGIN;

ALTER TABLE pokemon ADD COLUMN gen_id INTEGER NOT NULL DEFAULT 0;

COMMIT;

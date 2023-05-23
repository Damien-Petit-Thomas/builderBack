-- Revert obuilder:random-function from pg

BEGIN;

DROP FUNCTION random_team();

COMMIT;

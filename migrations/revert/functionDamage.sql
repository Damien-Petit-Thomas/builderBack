-- Revert obuilder:functionDamage from pg

BEGIN;

DROP FUNCTION findDamage(int, float);
COMMIT;

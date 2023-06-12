-- Revert obuilder:filterV2 from pg

BEGIN;

DROP FUNCTION filterTypes(int[], int[]);
DROP FUNCTION filterTypes(int[]);


COMMIT;

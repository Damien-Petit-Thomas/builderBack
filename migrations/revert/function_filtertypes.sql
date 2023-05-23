-- Revert obuilder:function_filtertypes from pg

BEGIN;

DROP FUNCTION filterTypes(int[], int[]);

COMMIT;

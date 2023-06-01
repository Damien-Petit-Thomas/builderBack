-- Deploy obuilder:functionDamage to pg

BEGIN;

CREATE OR REPLACE FUNCTION findDamage(
  id varchar,
  multiplicator float
)
RETURNS SETOF type AS $$
SELECT *
FROM type
WHERE (
  SELECT COUNT(*)
  FROM json_array_elements(damagefrom::json) AS elem
  WHERE (elem->>'id')  = $1
    AND (elem->>'damage')::float <= $2
) > 0;
$$ LANGUAGE sql;

COMMIT;

BEGIN;
CREATE OR REPLACE FUNCTION filterTypes(
  ids int[],
  matches int[]
)
RETURNS TABLE (
  type_id int,
  type_name text,
  matching_count int,
  matching_ids int[]
)
AS $$
BEGIN
  RETURN QUERY
  SELECT id::int, name::text,
    (
      SELECT COUNT(*)::int
      FROM json_array_elements(type.damagefrom::json) AS elem
      WHERE (elem->>'damage')::float <= 0.5
        AND (elem->>'id')::int = ANY(ids)
    ) AS matching_count,
    ARRAY(
      SELECT unnest(ids) AS matching_id
      INTERSECT
      SELECT (elem->>'id')::int
      FROM json_array_elements(type.damagefrom::json) AS elem
      WHERE (elem->>'damage')::float <= 0.5
        AND (elem->>'id')::int = ANY(ids)
    ) AS matching_ids
  FROM type
  WHERE (
    SELECT COUNT(*)
    FROM json_array_elements(type.damagefrom::json) AS elem
    WHERE (elem->>'damage')::float <= 0.5
      AND (elem->>'id')::int = ANY(ids)
    
  ) IN (SELECT unnest(matches)) AND matching_count > 0 ORDER BY matching_count DESC;

END;
$$ LANGUAGE plpgsql;
COMMIT;

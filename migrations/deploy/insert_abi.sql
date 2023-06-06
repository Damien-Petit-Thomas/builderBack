-- Deploy obuilder:insert_abi to pg

BEGIN;

CREATE OR REPLACE FUNCTION insert_ability(json) RETURNS ability AS $$
INSERT INTO "ability" (
  id,
  name,
  frenchname,
  description,
  damagefrom
) VALUES (
  ($1->>'id')::smallint,
  $1->>'name',
  $1->>'frenchname',
  $1->>'description',
  ($1->>'damagefrom')::jsonb
) RETURNING *

$$ LANGUAGE SQL VOLATILE;

COMMIT;

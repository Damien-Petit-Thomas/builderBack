-- Deploy obuilder:alter-insert to pg

BEGIN;

CREATE OR REPLACE FUNCTION insert_pokemon(json) RETURNS  pokemon AS $$

INSERT INTO "pokemon" (
  id,
  name,
  sprite,
  type1,
  type2,
  gen_id,
  hp,
  attack,
  defense,
  sp_att,
  sp_def,
  speed
) VALUES (
  ($1->>'id')::smallint,
  $1->>'name',
  $1->>'sprite',
  ($1->>'type1')::smallint,
  COALESCE(($1->>'type2')::smallint, NULL),
  ($1->>'gen_id')::smallint,
  ($1->>'hp')::smallint,
  ($1->>'attack')::smallint,
  ($1->>'defense')::smallint,
  ($1->>'specialAttack')::smallint,
  ($1->>'specialDefense')::smallint,
  ($1->>'speed')::smallint
) RETURNING *

$$ LANGUAGE SQL VOLATILE;
COMMIT;

-- Deploy obuilder:random-function to pg

BEGIN;
CREATE OR REPLACE FUNCTION random_team() RETURNS SETOF int AS $$
  SELECT DISTINCT id
  FROM pokemon 
  ORDER BY random() 
  LIMIT 6;
$$ LANGUAGE SQL VOLATILE;




COMMIT;

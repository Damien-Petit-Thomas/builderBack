-- Deploy obuilder:random-function to pg

BEGIN;
CREATE OR REPLACE FUNCTION random_team() RETURNS SETOF pokemon AS $$
  SELECT *
  FROM pokemon 
  ORDER BY random() 
  LIMIT 6;
$$ LANGUAGE SQL VOLATILE;




COMMIT;

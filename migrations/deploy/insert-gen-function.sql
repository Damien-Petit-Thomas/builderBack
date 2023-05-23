-- Deploy obuilder:insert-gen-function to pg

BEGIN;

CREATE OR REPLACE FUNCTION gen_id(start_id int, end_id int) RETURNS SETOF gen AS $$
BEGIN
  INSERT INTO gen (id)
  SELECT generate_series(start_id, end_id);

  RETURN QUERY SELECT * FROM gen WHERE id >= start_id AND id <= end_id;
END;
$$ LANGUAGE PLPGSQL;

COMMIT;

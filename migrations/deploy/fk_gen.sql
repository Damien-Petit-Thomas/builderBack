-- Deploy obuilder:fk_gen to pg

BEGIN;

ALTER TABLE pokemon ADD CONSTRAINT pokemon_gen_id_fkey FOREIGN KEY (gen_id) REFERENCES gen (id);


COMMIT;

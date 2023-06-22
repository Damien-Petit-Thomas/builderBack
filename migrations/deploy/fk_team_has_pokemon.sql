-- Deploy obuilder:fk_team_has_pokemon to pg

BEGIN;

ALTER TABLE team_has_pokemon ADD CONSTRAINT team_has_pokemon_pokemon_id_fkey FOREIGN KEY (pokemon_id) REFERENCES pokemon (id);
ALTER TABLE team_has_pokemon ADD CONSTRAINT team_has_pokemon_team_id_fkey FOREIGN KEY (team_id) REFERENCES team (id);

COMMIT;

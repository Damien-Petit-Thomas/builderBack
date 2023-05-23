-- Revert obuilder:team_pokemon from pg

BEGIN;

CREATE TABLE IF NOT EXISTS "team_has_pokemon" (
id serial PRIMARY KEY,
team_id integer NOT NULL,
pokemon_id integer NOT NULL
);

COMMIT;

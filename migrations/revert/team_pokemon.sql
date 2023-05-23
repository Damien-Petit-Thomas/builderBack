-- Revert obuilder:team_pokemon from pg

BEGIN;
DROP TABLE IF EXISTS "team_has_pokemon";

COMMIT;

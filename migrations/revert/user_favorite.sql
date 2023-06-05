-- Revert obuilder:user_favorite from pg

BEGIN;

DROP TABLE user_has_favorite;

COMMIT;

-- Deploy obuilder:user_favorite to pg

BEGIN;


CREATE TABLE user_has_favorite (
    user_id  INTEGER NOT NULL,
    favorite_id  INTEGER NOT NULL,
    PRIMARY KEY (user_id, favorite_id),
    FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE,
    FOREIGN KEY (favorite_id) REFERENCES "pokemon" (id) ON DELETE CASCADE
);

COMMIT;

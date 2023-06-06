-- Deploy obuilder:ability to pg

BEGIN;

CREATE TABLE ability (
  id SMALLINT  PRIMARY KEY,
  name varchar(50) NOT NULL,
  frenchname varchar(50) NOT NULL,
  description text NOT NULL,
  damageFrom JSONB DEFAULT '[]'::jsonb
);


CREATE  TABLE pokemon_ability (
  pokemon_id INT NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
  ability_id INT NOT NULL REFERENCES ability(id) ON DELETE CASCADE,
  PRIMARY KEY (pokemon_id, ability_id) 
);

COMMIT;

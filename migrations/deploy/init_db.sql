-- Deploy obuilder:init_db to pg

BEGIN;


CREATE TABLE if NOT EXISTS "type" (
  id smallint  PRIMARY KEY,
  name varchar(50) NOT NULL UNIQUE,
  frenchName varchar(50) NOT NULL,
  damageFrom json NOT NULL
);

CREATE TABLE if NOT EXISTS "pokemon" (
    id smallint  PRIMARY KEY,
  name  varchar(50) NOT NULL,
  sprite varchar(200) NOT NULL,
  type1 smallint NOT NULL REFERENCES type(id),
  type2 smallint REFERENCES type(id),
  hp smallint NOT NULL,
  attack smallint NOT NULL,
  defense smallint NOT NULL,
  sp_att smallint NOT NULL,
  sp_def smallint NOT NULL,
  speed smallint NOT NULL
);

COMMIT;

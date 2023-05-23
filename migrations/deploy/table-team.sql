-- Deploy obuilder:table-team to pg

BEGIN;
CREATE TABLE "team" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(255) NOT NULL DEFAULT 'team'
);
COMMIT;

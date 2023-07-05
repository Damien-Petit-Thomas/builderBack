-- Deploy obuilder:admin to pg

BEGIN;

CREATE TABLE "admin" (
  "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text NOT NULL,
  "email" email NOT NULL UNIQUE,
  "password" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()  
);

COMMIT;

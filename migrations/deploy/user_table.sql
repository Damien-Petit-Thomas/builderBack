-- Deploy obuilder:user_table to pg

BEGIN;
CREATE DOMAIN "email" AS text
CHECK(
   VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
);
CREATE TABLE "user" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" email NOT NULL UNIQUE,
    "password"  TEXT NOT NULL,
    "username" varchar(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;

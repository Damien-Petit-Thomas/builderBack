PGDMP     	    )                |            d18nvcfn74av10     15.5 (Ubuntu 15.5-1.pgdg20.04+1)    15.1 H    R           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            S           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            T           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            U           1262    3472522    d18nvcfn74av10    DATABASE     |   CREATE DATABASE "d18nvcfn74av10" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
     DROP DATABASE "d18nvcfn74av10";
                nanoygcrloaitz    false            V           0    0    d18nvcfn74av10    DATABASE PROPERTIES     V   ALTER DATABASE "d18nvcfn74av10" SET "search_path" TO '$user', 'public', 'heroku_ext';
                     nanoygcrloaitz    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                nanoygcrloaitz    false            W           0    0    SCHEMA "public"    COMMENT     8   COMMENT ON SCHEMA "public" IS 'standard public schema';
                   nanoygcrloaitz    false    7                        3079    3472556    pg_stat_statements 	   EXTENSION     N   CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "heroku_ext";
 %   DROP EXTENSION "pg_stat_statements";
                   false            X           0    0    EXTENSION "pg_stat_statements"    COMMENT     w   COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';
                        false    3                        3079    3472636    unaccent 	   EXTENSION     D   CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "heroku_ext";
    DROP EXTENSION "unaccent";
                   false            Y           0    0    EXTENSION "unaccent"    COMMENT     R   COMMENT ON EXTENSION "unaccent" IS 'text search dictionary that removes accents';
                        false    2            j           1247    3474178    email    DOMAIN     !  CREATE DOMAIN "public"."email" AS "text"
	CONSTRAINT "email_check" CHECK ((VALUE ~ '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'::"text"));
    DROP DOMAIN "public"."email";
       public          nanoygcrloaitz    false    7            �           1247    5940998    password    DOMAIN     �   CREATE DOMAIN "public"."password" AS "text"
	CONSTRAINT "password_check" CHECK ((VALUE ~ '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$'::"text"));
 !   DROP DOMAIN "public"."password";
       public          nanoygcrloaitz    false    7            �            1255    3474180    filtertypes(integer[])    FUNCTION     �  CREATE FUNCTION "public"."filtertypes"("ids" integer[]) RETURNS TABLE("type_id" integer, "type_name" "text", "matching_count" integer, "matching_ids" integer[])
    LANGUAGE "plpgsql"
    AS $$

BEGIN
  RETURN QUERY
  SELECT id::int, name::text,
    (
      SELECT COUNT(*)::int
      FROM json_array_elements(type.damagefrom::json) AS elem
      WHERE (elem->>'damage')::float <= 0.5
        AND (elem->>'id')::int = ANY(ids)
    ) AS matching_count,
    ARRAY(
      SELECT unnest(ids) AS matching_id
      INTERSECT
      SELECT (elem->>'id')::int
      FROM json_array_elements(type.damagefrom::json) AS elem
      WHERE (elem->>'damage')::float <= 0.5
        AND (elem->>'id')::int = ANY(ids)
    ) AS matching_ids
  FROM type
  WHERE (
    SELECT COUNT(*)
    FROM json_array_elements(type.damagefrom::json) AS elem
    WHERE (elem->>'damage')::float <= 0.5
      AND (elem->>'id')::int = ANY(ids)
    
  ) > 0
  order by matching_count DESC;

END;
$$;
 7   DROP FUNCTION "public"."filtertypes"("ids" integer[]);
       public          nanoygcrloaitz    false    7            �            1255    3474183 !   filtertypes(integer[], integer[])    FUNCTION     �  CREATE FUNCTION "public"."filtertypes"("ids" integer[], "excluded_ids" integer[]) RETURNS TABLE("type_id" integer, "type_name" "text", "matching_count" integer, "matching_ids" integer[])
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT id::int, name::text,
    (
      SELECT COUNT(*)::int
      FROM json_array_elements(type.damagefrom::json) AS elem
      WHERE (elem->>'damage')::float <= 0.5
        AND (elem->>'id')::int = ANY(ids)
    ) AS matching_count,
    ARRAY(
      SELECT unnest(ids) AS matching_id
      INTERSECT
      SELECT (elem->>'id')::int
      FROM json_array_elements(type.damagefrom::json) AS elem
      WHERE (elem->>'damage')::float <= 0.5
        AND (elem->>'id')::int = ANY(ids)
    ) AS matching_ids
  FROM type
  WHERE (
    SELECT COUNT(*)
    FROM json_array_elements(type.damagefrom::json) AS elem
    WHERE (elem->>'damage')::float <= 0.5
      AND (elem->>'id')::int = ANY(ids)
  ) > 0
  AND NOT EXISTS (
    SELECT 1
    FROM json_array_elements(type.damagefrom::json) AS elem
    WHERE (elem->>'damage')::float > 1
      AND (elem->>'id')::int = ANY(excluded_ids)
  )
  ORDER BY matching_count DESC;
END;
$$;
 Q   DROP FUNCTION "public"."filtertypes"("ids" integer[], "excluded_ids" integer[]);
       public          nanoygcrloaitz    false    7            �            1259    3474186    type    TABLE     �   CREATE TABLE "public"."type" (
    "id" smallint NOT NULL,
    "name" character varying(50) NOT NULL,
    "frenchname" character varying(50) NOT NULL,
    "damagefrom" "json" NOT NULL
);
    DROP TABLE "public"."type";
       public         heap    nanoygcrloaitz    false    7            �            1255    3474194 /   finddamage(character varying, double precision)    FUNCTION     M  CREATE FUNCTION "public"."finddamage"("id" character varying, "multiplicator" double precision) RETURNS SETOF "public"."type"
    LANGUAGE "sql"
    AS $_$
SELECT *
FROM type
WHERE (
  SELECT COUNT(*)
  FROM json_array_elements(damagefrom::json) AS elem
  WHERE (elem->>'id')  = $1
    AND (elem->>'damage')::float <= $2
) > 0;
$_$;
 _   DROP FUNCTION "public"."finddamage"("id" character varying, "multiplicator" double precision);
       public          nanoygcrloaitz    false    7    219            �            1259    3474195    gen    TABLE     <   CREATE TABLE "public"."gen" (
    "id" smallint NOT NULL
);
    DROP TABLE "public"."gen";
       public         heap    nanoygcrloaitz    false    7            �            1255    3474198    gen_id(integer, integer)    FUNCTION     !  CREATE FUNCTION "public"."gen_id"("start_id" integer, "end_id" integer) RETURNS SETOF "public"."gen"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO gen (id)
  SELECT generate_series(start_id, end_id);

  RETURN QUERY SELECT * FROM gen WHERE id >= start_id AND id <= end_id;
END;
$$;
 G   DROP FUNCTION "public"."gen_id"("start_id" integer, "end_id" integer);
       public          nanoygcrloaitz    false    220    7            �            1259    3474199    ability    TABLE     �   CREATE TABLE "public"."ability" (
    "id" smallint NOT NULL,
    "name" character varying(50) NOT NULL,
    "frenchname" character varying(50) NOT NULL,
    "description" "text" NOT NULL,
    "damagefrom" "jsonb" DEFAULT '[]'::"jsonb"
);
    DROP TABLE "public"."ability";
       public         heap    nanoygcrloaitz    false    7            �            1255    3474205    insert_ability("json")    FUNCTION     J  CREATE FUNCTION "public"."insert_ability"("json") RETURNS "public"."ability"
    LANGUAGE "sql"
    AS $_$
INSERT INTO "ability" (
  id,
  name,
  frenchname,
  description,
  damagefrom
) VALUES (
  ($1->>'id')::smallint,
  $1->>'name',
  $1->>'frenchname',
  $1->>'description',
  ($1->>'damagefrom')::jsonb
) RETURNING *

$_$;
 1   DROP FUNCTION "public"."insert_ability"("json");
       public          nanoygcrloaitz    false    7    221            �            1259    3474206    pokemon    TABLE     �  CREATE TABLE "public"."pokemon" (
    "id" smallint NOT NULL,
    "name" character varying(50) NOT NULL,
    "sprite" character varying(200) NOT NULL,
    "type1" smallint NOT NULL,
    "type2" smallint,
    "hp" smallint NOT NULL,
    "attack" smallint NOT NULL,
    "defense" smallint NOT NULL,
    "sp_att" smallint NOT NULL,
    "sp_def" smallint NOT NULL,
    "speed" smallint NOT NULL,
    "gen_id" integer DEFAULT 0 NOT NULL
);
    DROP TABLE "public"."pokemon";
       public         heap    nanoygcrloaitz    false    7                        1255    3474210    insert_pokemon("json")    FUNCTION     d  CREATE FUNCTION "public"."insert_pokemon"("json") RETURNS "public"."pokemon"
    LANGUAGE "sql"
    AS $_$

INSERT INTO "pokemon" (
  id,
  name,
  sprite,
  type1,
  type2,
  gen_id,
  hp,
  attack,
  defense,
  sp_att,
  sp_def,
  speed
) VALUES (
  ($1->>'id')::smallint,
  $1->>'name',
  $1->>'sprite',
  ($1->>'type1')::smallint,
  COALESCE(($1->>'type2')::smallint, NULL),
  ($1->>'gen_id')::smallint,
  ($1->>'hp')::smallint,
  ($1->>'attack')::smallint,
  ($1->>'defense')::smallint,
  ($1->>'specialAttack')::smallint,
  ($1->>'specialDefense')::smallint,
  ($1->>'speed')::smallint
) RETURNING *

$_$;
 1   DROP FUNCTION "public"."insert_pokemon"("json");
       public          nanoygcrloaitz    false    7    222                       1255    3474211    insert_type("json")    FUNCTION       CREATE FUNCTION "public"."insert_type"("json") RETURNS "public"."type"
    LANGUAGE "sql"
    AS $_$

INSERT INTO "type" (
  id,
  name,
  frenchName,
  damageFrom
) VALUES (
  ($1->>'id')::smallint,
  $1->>'name',
  $1->>'frenchName',
  ($1->>'damageFrom')::json
) RETURNING *

$_$;
 .   DROP FUNCTION "public"."insert_type"("json");
       public          nanoygcrloaitz    false    7    219                       1255    3474212    random_team()    FUNCTION     �   CREATE FUNCTION "public"."random_team"() RETURNS SETOF "public"."pokemon"
    LANGUAGE "sql"
    AS $$
  SELECT *
  FROM pokemon 
  ORDER BY random() 
  LIMIT 6;
$$;
 (   DROP FUNCTION "public"."random_team"();
       public          nanoygcrloaitz    false    7    222            �            1259    5969347    admin    TABLE     (  CREATE TABLE "public"."admin" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "email" "public"."email" NOT NULL,
    "password" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);
    DROP TABLE "public"."admin";
       public         heap    nanoygcrloaitz    false    874    7            �            1259    5969346    admin_id_seq    SEQUENCE     �   ALTER TABLE "public"."admin" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."admin_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          nanoygcrloaitz    false    232    7            �            1259    3474213    pokemon_ability    TABLE     r   CREATE TABLE "public"."pokemon_ability" (
    "pokemon_id" integer NOT NULL,
    "ability_id" integer NOT NULL
);
 '   DROP TABLE "public"."pokemon_ability";
       public         heap    nanoygcrloaitz    false    7            �            1259    3474216    team    TABLE     �   CREATE TABLE "public"."team" (
    "id" integer NOT NULL,
    "name" character varying(255) DEFAULT 'team'::character varying NOT NULL,
    "user_id" integer NOT NULL
);
    DROP TABLE "public"."team";
       public         heap    nanoygcrloaitz    false    7            �            1259    3474220    team_has_pokemon    TABLE     �   CREATE TABLE "public"."team_has_pokemon" (
    "id" integer NOT NULL,
    "team_id" integer NOT NULL,
    "pokemon_id" integer NOT NULL
);
 (   DROP TABLE "public"."team_has_pokemon";
       public         heap    nanoygcrloaitz    false    7            �            1259    3474223    team_has_pokemon_id_seq    SEQUENCE     �   CREATE SEQUENCE "public"."team_has_pokemon_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE "public"."team_has_pokemon_id_seq";
       public          nanoygcrloaitz    false    225    7            Z           0    0    team_has_pokemon_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE "public"."team_has_pokemon_id_seq" OWNED BY "public"."team_has_pokemon"."id";
          public          nanoygcrloaitz    false    226            �            1259    3474224    team_id_seq    SEQUENCE     �   ALTER TABLE "public"."team" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."team_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          nanoygcrloaitz    false    224    7            �            1259    3474225    user    TABLE     !  CREATE TABLE "public"."user" (
    "id" integer NOT NULL,
    "email" "public"."email" NOT NULL,
    "password" "text" NOT NULL,
    "username" character varying(50) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone
);
    DROP TABLE "public"."user";
       public         heap    nanoygcrloaitz    false    874    7            �            1259    3474232    user_has_favorite    TABLE     r   CREATE TABLE "public"."user_has_favorite" (
    "user_id" integer NOT NULL,
    "favorite_id" integer NOT NULL
);
 )   DROP TABLE "public"."user_has_favorite";
       public         heap    nanoygcrloaitz    false    7            �            1259    3474235    user_id_seq    SEQUENCE     �   ALTER TABLE "public"."user" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          nanoygcrloaitz    false    228    7            �           2604    3474236    team_has_pokemon id    DEFAULT     �   ALTER TABLE ONLY "public"."team_has_pokemon" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."team_has_pokemon_id_seq"'::"regclass");
 H   ALTER TABLE "public"."team_has_pokemon" ALTER COLUMN "id" DROP DEFAULT;
       public          nanoygcrloaitz    false    226    225            D          0    3474199    ability 
   TABLE DATA           ^   COPY "public"."ability" ("id", "name", "frenchname", "description", "damagefrom") FROM stdin;
    public          nanoygcrloaitz    false    221            O          0    5969347    admin 
   TABLE DATA           b   COPY "public"."admin" ("id", "name", "email", "password", "created_at", "updated_at") FROM stdin;
    public          nanoygcrloaitz    false    232            C          0    3474195    gen 
   TABLE DATA           '   COPY "public"."gen" ("id") FROM stdin;
    public          nanoygcrloaitz    false    220            E          0    3474206    pokemon 
   TABLE DATA           �   COPY "public"."pokemon" ("id", "name", "sprite", "type1", "type2", "hp", "attack", "defense", "sp_att", "sp_def", "speed", "gen_id") FROM stdin;
    public          nanoygcrloaitz    false    222            F          0    3474213    pokemon_ability 
   TABLE DATA           I   COPY "public"."pokemon_ability" ("pokemon_id", "ability_id") FROM stdin;
    public          nanoygcrloaitz    false    223            G          0    3474216    team 
   TABLE DATA           ;   COPY "public"."team" ("id", "name", "user_id") FROM stdin;
    public          nanoygcrloaitz    false    224            H          0    3474220    team_has_pokemon 
   TABLE DATA           M   COPY "public"."team_has_pokemon" ("id", "team_id", "pokemon_id") FROM stdin;
    public          nanoygcrloaitz    false    225            B          0    3474186    type 
   TABLE DATA           L   COPY "public"."type" ("id", "name", "frenchname", "damagefrom") FROM stdin;
    public          nanoygcrloaitz    false    219            K          0    3474225    user 
   TABLE DATA           e   COPY "public"."user" ("id", "email", "password", "username", "created_at", "updated_at") FROM stdin;
    public          nanoygcrloaitz    false    228            L          0    3474232    user_has_favorite 
   TABLE DATA           I   COPY "public"."user_has_favorite" ("user_id", "favorite_id") FROM stdin;
    public          nanoygcrloaitz    false    229            [           0    0    admin_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('"public"."admin_id_seq"', 1, true);
          public          nanoygcrloaitz    false    231            \           0    0    team_has_pokemon_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('"public"."team_has_pokemon_id_seq"', 444, true);
          public          nanoygcrloaitz    false    226            ]           0    0    team_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('"public"."team_id_seq"', 77, true);
          public          nanoygcrloaitz    false    227            ^           0    0    user_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('"public"."user_id_seq"', 45, true);
          public          nanoygcrloaitz    false    230            �           2606    3474255    ability ability_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY "public"."ability"
    ADD CONSTRAINT "ability_pkey" PRIMARY KEY ("id");
 D   ALTER TABLE ONLY "public"."ability" DROP CONSTRAINT "ability_pkey";
       public            nanoygcrloaitz    false    221            �           2606    5969357    admin admin_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_email_key" UNIQUE ("email");
 E   ALTER TABLE ONLY "public"."admin" DROP CONSTRAINT "admin_email_key";
       public            nanoygcrloaitz    false    232            �           2606    5969355    admin admin_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY "public"."admin"
    ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("id");
 @   ALTER TABLE ONLY "public"."admin" DROP CONSTRAINT "admin_pkey";
       public            nanoygcrloaitz    false    232            �           2606    3474257    gen gen_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY "public"."gen"
    ADD CONSTRAINT "gen_pkey" PRIMARY KEY ("id");
 <   ALTER TABLE ONLY "public"."gen" DROP CONSTRAINT "gen_pkey";
       public            nanoygcrloaitz    false    220            �           2606    3474259 $   pokemon_ability pokemon_ability_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY "public"."pokemon_ability"
    ADD CONSTRAINT "pokemon_ability_pkey" PRIMARY KEY ("pokemon_id", "ability_id");
 T   ALTER TABLE ONLY "public"."pokemon_ability" DROP CONSTRAINT "pokemon_ability_pkey";
       public            nanoygcrloaitz    false    223    223            �           2606    3474261    pokemon pokemon_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY "public"."pokemon"
    ADD CONSTRAINT "pokemon_pkey" PRIMARY KEY ("id");
 D   ALTER TABLE ONLY "public"."pokemon" DROP CONSTRAINT "pokemon_pkey";
       public            nanoygcrloaitz    false    222            �           2606    3474263 &   team_has_pokemon team_has_pokemon_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY "public"."team_has_pokemon"
    ADD CONSTRAINT "team_has_pokemon_pkey" PRIMARY KEY ("id");
 V   ALTER TABLE ONLY "public"."team_has_pokemon" DROP CONSTRAINT "team_has_pokemon_pkey";
       public            nanoygcrloaitz    false    225            �           2606    3474265    team team_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");
 >   ALTER TABLE ONLY "public"."team" DROP CONSTRAINT "team_pkey";
       public            nanoygcrloaitz    false    224            �           2606    3474267    type type_name_key 
   CONSTRAINT     U   ALTER TABLE ONLY "public"."type"
    ADD CONSTRAINT "type_name_key" UNIQUE ("name");
 B   ALTER TABLE ONLY "public"."type" DROP CONSTRAINT "type_name_key";
       public            nanoygcrloaitz    false    219            �           2606    3474269    type type_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY "public"."type"
    ADD CONSTRAINT "type_pkey" PRIMARY KEY ("id");
 >   ALTER TABLE ONLY "public"."type" DROP CONSTRAINT "type_pkey";
       public            nanoygcrloaitz    false    219            �           2606    3474271    user user_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_email_key" UNIQUE ("email");
 C   ALTER TABLE ONLY "public"."user" DROP CONSTRAINT "user_email_key";
       public            nanoygcrloaitz    false    228            �           2606    3474273 (   user_has_favorite user_has_favorite_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY "public"."user_has_favorite"
    ADD CONSTRAINT "user_has_favorite_pkey" PRIMARY KEY ("user_id", "favorite_id");
 X   ALTER TABLE ONLY "public"."user_has_favorite" DROP CONSTRAINT "user_has_favorite_pkey";
       public            nanoygcrloaitz    false    229    229            �           2606    3474275    user user_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
 >   ALTER TABLE ONLY "public"."user" DROP CONSTRAINT "user_pkey";
       public            nanoygcrloaitz    false    228            �           1259    3474276    type_idx    INDEX     C   CREATE INDEX "type_idx" ON "public"."type" USING "btree" ("name");
     DROP INDEX "public"."type_idx";
       public            nanoygcrloaitz    false    219            �           2606    3474277 /   pokemon_ability pokemon_ability_ability_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."pokemon_ability"
    ADD CONSTRAINT "pokemon_ability_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "public"."ability"("id") ON DELETE CASCADE;
 _   ALTER TABLE ONLY "public"."pokemon_ability" DROP CONSTRAINT "pokemon_ability_ability_id_fkey";
       public          nanoygcrloaitz    false    223    4248    221            �           2606    3474282 /   pokemon_ability pokemon_ability_pokemon_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."pokemon_ability"
    ADD CONSTRAINT "pokemon_ability_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemon"("id") ON DELETE CASCADE;
 _   ALTER TABLE ONLY "public"."pokemon_ability" DROP CONSTRAINT "pokemon_ability_pokemon_id_fkey";
       public          nanoygcrloaitz    false    4250    222    223            �           2606    3474287    pokemon pokemon_type1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."pokemon"
    ADD CONSTRAINT "pokemon_type1_fkey" FOREIGN KEY ("type1") REFERENCES "public"."type"("id");
 J   ALTER TABLE ONLY "public"."pokemon" DROP CONSTRAINT "pokemon_type1_fkey";
       public          nanoygcrloaitz    false    219    4244    222            �           2606    3474292    pokemon pokemon_type2_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."pokemon"
    ADD CONSTRAINT "pokemon_type2_fkey" FOREIGN KEY ("type2") REFERENCES "public"."type"("id");
 J   ALTER TABLE ONLY "public"."pokemon" DROP CONSTRAINT "pokemon_type2_fkey";
       public          nanoygcrloaitz    false    222    4244    219            �           2606    3474297    team team_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."team"
    ADD CONSTRAINT "team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;
 F   ALTER TABLE ONLY "public"."team" DROP CONSTRAINT "team_user_id_fkey";
       public          nanoygcrloaitz    false    228    4260    224            �           2606    3474302 4   user_has_favorite user_has_favorite_favorite_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."user_has_favorite"
    ADD CONSTRAINT "user_has_favorite_favorite_id_fkey" FOREIGN KEY ("favorite_id") REFERENCES "public"."pokemon"("id") ON DELETE CASCADE;
 d   ALTER TABLE ONLY "public"."user_has_favorite" DROP CONSTRAINT "user_has_favorite_favorite_id_fkey";
       public          nanoygcrloaitz    false    222    4250    229            �           2606    3474307 0   user_has_favorite user_has_favorite_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY "public"."user_has_favorite"
    ADD CONSTRAINT "user_has_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;
 `   ALTER TABLE ONLY "public"."user_has_favorite" DROP CONSTRAINT "user_has_favorite_user_id_fkey";
       public          nanoygcrloaitz    false    4260    229    228            D      x��}�rI����+�j�H#�w�Hꑚ�*Y�J���8 O��A
k����vf5���t��lzӛ��5���dι��D��*�fCAD����{�=�U�&���u���TN�1�u~��%ͳ?MU����6�tU<|ѳ<[���Oտ���$ژ���r����k:��Yb�S���s�:ݨ��ݹ��V��]�WYW�]���K��h�}��&����I7��MT�U%�h���w��&�0�#FUDs��s^��̧M����&�y?U&zn��U��晌�H�tY&&�.͝�pi�f�(�7^�m\��d��S^m�������l���W�'�1׎c�31Ug?N��rz������.��m���u��0��"g0Y�[�qʵαn��su�_��+��ڭ8��3\���KgeZ"97��b}1�%���z^F���#��/)G'[L���LR|gl�>�61э�2���:�(�^w&ZT툒�2_��cə����c<N�[��8��×��gsm�B�Ǽµ0in�B�K��0����BRPH>|�Nd�h:1gdӴ�,�X���̤/5����v�0N����8�U&.#>U�MgƩ��1��r)�������:�{?|�_��
7�-�Ʉ!��ɷ~�U�1f��(�{h�������;�;z�G
�
3��pr�������L]�/�g�C�;Λ�1Q�\7�=��%�ρI��W3�昧�ȟ��ș�^��Y�ID�����ץq���շ'�ڡ+�T�fV����P،���RO-r��0�ؒkk�E���@�3�Z-��]da�M����Δ/f�$^�W3���WhЬ���/� ��2���$�;<3�5�ɩ��Tn�=��]-�6��H/}T	&Z���17�-���)�!l(�5�����)��G�l�"ښ��v�y-!�����د:�vx~[Ԋxr��	�,�l5��^9[��,�����X�V����HA�/3U�,�w�W�&��ٙL��Q����Ϣ���̇�#�-6#�+���s�X���ﳘ:.W��3�6��{���\���N�h\f�[�m�N�W���U;_'Xh��<[�}����!������ �{0L
'{��şSN���8Q�7���O}�Bb����z(⵴�p;�l|�N�P�;�ӛ�~��K<{��q<�m�x��z��ǥ^����Hg�s/j��C~�p���Oǡt,�t
%PZ�h%��phX�U+�d"s̎s�{��n�2\ϋ� ���5�����~ 0�ی����F��c�{��Ŝ���$X��X`�1{�=�،[گ3�E	�O~F`��`ָ�`����m�;�h��|%x�FC�������9��?�+��u��U�lЃ%�s���@���	�+�����Σ߉����R�����s�P���� p2�д烕>V���.^U�-�+�0��mA@�\vS�4W1Ň��5x�Fn{�Q#	ќ^I��[�Z��TD�������\TL���CM*���ŏ�H��Z����|m O��ؗ�����4�a-������u�L����u��=�e3��^�����{֊FJ�ʼ���i� ��c8Q��&�{��E��l��؝�jyl[�u�'^��
�a2C�ϱ���_2~��Yy�5W�Q��2�^Ռ^e��{����T�J('�.f�nL���9��7^�s�*��>�	�����{���/P��]�;ڙ��OE]
���{�rt�R�Ju�y{9��c݀���ۇ
�������S&Z���j]�L�����`��*�����zQKH���G52���*��*���d8��aq)ESb#��YCp��z�$�=~�*n�01j��(�c����D�q ᷎�<X�����/n�!�Y����� �[?�p��OֵbP'w���YNT)�}�\k���}HQ�s�:e&(�Z��0�T ��I�"~iϔWXWX7(�����W#]��U�(���8�RN�ƛ
��ǐ��垱n`�/��]��?�fU��
5ά}��-������?�.'Ѕ �K`��Ɨ�D]�Y�E��C�O��rw���	X�+�߲�[4��j#�ۮp��Q�k���P�(We����1H�s���E�hP(���d=�&?�3k�l㙅I|���os�=)>��+M�R�7���"�#<��g
|�S%�A�S<��<ԔAT��#���T�a �+�;�=����C�
�'����^]�k���)K��)I��.r����'jõ�徖E��x���o����"B�n�x]s2Y�/\׍Ɉ�dv	~����ՒC�nE�>QvO�y_C�ukLFWO����P������>��ݷ	����4����V�N�FtՈ-p�ȕ�J'�uT/��ZѸ���)A�?a�h�����Xذغ���5E�E����4+������-�q�Q�Jp�$&�
����#�v*�a(���gU�Hgbs��N>�F�3�"U��Q�C�R���R����U��p3���� �ǧ�R����Mg�7b�t2NRAB,t���n=�kk��
��k���)>r��_��a�a�(鍐h�钾�L&*zi*^���x!P&�=u��+N����6^�	�����B�<IhLD�q��Y��0���- ������ �ς����_���7�V�V���h����T��� ӝ���)��hd�MZ��t����s�SE�!�'c��b�_�l0Y���@���:���1�?I��#!�]V�	�?�]���D0���7�W�N;۟���{���$\=�H>?Q@�N���F�E"}��R_RG׎�?����Ts����sgW��}�����AnC9����v�''J/a|S]��e���K�#�.u��������ק�C�%�nQ��V�iѲa��Wt�׸n29UE�����e6[��J��w�Uϡ>��v�埓:2�ïcHdW�" ��z��S�����J��;ֿ��v�h*��wa.uC�� 8��H�\����K4 يZM5���-��Li�ږ1��o��6D��P�AM�g z�%�Ę����"z�c� -7yB����
\�4Ĕ�L��� s]b�{�~�\Q���;S�h���0�GA#�f�<m�s'��j��I�~oܬ�?.rI�W�6��FN� Rw¾,���΁?-���R?��lJC �/����g��(j��C%��YCPyj�	8�V.p�4a�$����~�	�0L�#k�s=9!0�uT��f�ƭ�Q/���sw7��l�և2����Z���9��e�UN`���Z�P�/%�q��$2��o�F/�Bz$x���y�0�s�П?'T&���p�P)5؛���[�����c��:�J�Q��e��)���Uo�i��X1���E�����s������������Ϸ��0���)7�[�r���0�w�5�h�#Ԝ3��zm
�3�k�Y`����A��.&"�$�����C����X��0Xo��,�o<�B�h�E�'#]d����X�`v���CHM�qp:�9�v�;ũY�9�X�$ꨠo�b�{�������`�6����#���i��˕X��.jN\Fx߉[ځ�VXȊ8���@f#n�!&�`'/�Y�6���0��_�ѓ�����^�����N�qi/��㘮��( ]�4^S0#���v�ۿ�&�Ϣ�fp�q��኿�g8�+~z����*հ�P�s�LFw����!���q��qw�ʋ�,�8���	���+Z3�A롺_��"�oMm~YA���&�,�?k]���:�^��Dq���߬��|~�.,���dw]��S�p�N0�����=��c��*@'K,���&��C������񻨗, �����X:f��o�D�U7��๵�%���zX�*���ru,�).t�ex��1�j���)�/З�n��G/� ����cɎ큡����)���BԂm�R�l��gj�gf� ����E�5�`������鍃�����Z��r��D�    �� )2�{<����΂���T��';����N?	Hv�86�DX>>������,�y���B����%���؎;9>���mA�����z穆!�j���pr&�f���_L�w�wp�Q�����\����DW��9���.-#�7� ipf!�ݱ��'`���T1R���.� ��P��T=�
��S<���0m0��1����[V/m�#[�vXd�0�Q�0=h5K���aH�{e�(i'�2��{�ۨ�VAxJ���Ɗ i�bU������/�.~���ȭ���>C'���}��g��nf�sr��9n.�zA(d�����N<�}~ f,���������GM����5i�x��S!� y���aVgk*	-��2�	�1ݪ`))z���G��
�_M=���c��*+r�}VL�)��8����>Z?NAk��u4dC��Ӧ����nO���#��(Z@��j�ӎ�9�v^��*y�Y����2�$[��R�U!Y��޽8���gǆN��袈s��=�E�~ xX��#+�fEx>��6��ɷ.h��w�^���ϟ͝N}Z�U��N��-f���KI���s�%6����Z/\��&[qT@����1�^>/F�:�(��uI�)v�@O��ä@@&�^�b��Ւ��s�K����YTo�4�}�	Q5X����k���IX�r$�U>&��_���$��N�8��F3��"JyN3�� ���3xx��TsX0�]	�:����c�~��M�lD�
��b���7� DJ�"^S�kkt�������{���Y��z��%��`z�=O=O"��Bl�l�Td �L��]A Jn����#�LX,|^����`�^�>�U7�J�ܘ��R��~�Gh�Ɂ*))�[��Ȗ�2���$f��-�3EJ�$�l�$m�����Ɩz_XX�6����y	�Tb��C�F�%{cS[z-���	(z>�!��F���ے�����2($��	��.�'��+�5?^r�z��f�%sN��&1p"�� �<�N�h�8I����T��k�(�.���ڏ�:)�
�l�n�Nĸ&f'���4_P���1H\I��9�Ç���SC��S%�9`ى�U���gy\�T��t��4�=�7�$�-���HFIu/w�w�O�i&W(w'��~�D�ꕳ%�����C"���¼�����E1��f'�D���R������1�GH�SI&E���Zpk0��+F���O[q��9a�&O�7����T�!9������DT�;`JN��v@.�M����g��c����N��E�<<PK�G���C ��汨¿e"���4~��u�n@ڐI E�M~�ߊ�J�����wp����9�����y���&/����~<�#2E�i�~��F0�$��r���jC/2�]�'�iW��o�ٶ��Z�l��i�m�Zc�'��Φqf ��Mδr1G4�O�s�(?�d'%tB~��/ʁxgt��~)��=����D��I��pM�)�X�(d=n�.:G�L]�@:_B��j��'��-��W�F�8Ǿ�|�r-���y/w���:�;��&Ov��ʡ�W.����"�M��e��[gL���Z]�[:�Ԩ��XA����Oᖫ�>�F��A7���uW�x�gt��xP�U�	$�f5m5�:4�H[��I<N�4U�(��]�'2`�]�^:3���tSnWt�a�vr�X���4RU�*�]~��h@�w%q�<_CbiP�Y�w3�R?��HR�6��͛�y�/�4�NK�k�y#��ǓQ'��<$Diz".ת�(�7qe@;@����x>�U�Z]j��n�e��T���'����>H��EAj��=��a����Lp\�lƻ|['�ON��3/s� J�����g�z��O$}JrS6�,<��=m�*�Ŭ� �ß�뜞��gUQ��������"�sW4�㓳C��s�e�3cɟ�Z�&���'d�}U�Χܣ��A.*�I�Uک���0�P%�Bg�|���⸜8aì�.5W�@u�s1�q�gC�7)e���|�W>�0��Z.�0N�'"1�I����(<�nQgI���^4f�i��L4,�~P��U�Au����O
���̙`sq���~���y�)wk��r�F6�A�nc"u�#���>ͬbT
�6KA� �޻�������Nu;;g�H漟5���G�^3�B
-��=�wL���]�:��x�߮�UX��|]X����p-���!���C֐���C���1�*��]6�acdN��@�dg�E�RWk+6:���2<V"f.|�yC�}�����X�ݳy��2z�Y��S�ff�L����%�v�"�=�pr�A�؆�萱=G����M���G�S�J��̳�z�@
�k�0��^��{�(>����F��&���#�� ����a��6���ٜ��p�q %�8A#1�^U��`������zHڃ��Q�)۟)<�hr��6�x'~��x'	�e_�S��I���n����.����J�Ɛ��G�{9�p�L�V8��soO�����a��iVQD! ȩZBX �:�j|��Ƶy��}��lG�jfW1��m�(Fs���g%����Պ./��K&���I�|�u>���M�9a�}��?|�~������5n�|^b���~!��7k����A�	a^B
t(�=t���B�CL�tg $L	u��q� t*-$��K�>�+�{�����f6����gt��oƵ[����^,����'ja�R7�Z9`Z��9��	)��,���>��Jχ���r�<�����b����R�Fc���(�>��p}�u�^q☇)i��������TQ,:�0��nHj��'��L�-ҐJy�ch_x�mZχ��o��7=�"�'��;㖾��'�~���E��=�,O}��s���y<U��y��E}�w�{�?��z���=��t�&�PהQI��
6��òJ~�������q�"^���������aܱ|ܗ1I����+jU��$����������*�&.�	k��w,����;O��#>�Z��i�����s�1�q1�r����5��P��@O�I���Q�h]�@=�u���Œ%\�S���$q<�at[6Ũ��뵷��������]R.]����++9��k|*b+�#$�Y+��$m��+7l'�y0Q���33�����<1#��"w	�<\�\U��a�F�y�N�s�eu�ë�a�r��:�XxN�Tܪ�� �Nqs���l_i��C��B��c�x΄D�	!Җ�f'�R�z���ϞI��C����}���k�# Gf��;ÜF��'�2o�f�x���%���J�=�� ϥ]�����b����7ˀH���gZ���2�;P��43�f]O+�u����'�v�5\�遧C)�o�@� {Bμ��N�.s5�J٦3�3;���^@Ú�f��+(�-�|�@�}����d�$�JH�e7�0��H1�*���
��_r�X��d�Uft(ܭz�4$R�3�����L,���q���m�{�'!bI=$��;B�t��d����G�xp�+9.tO�5E!�[`t�[�Y�o�X�J�Eδ�E��Qw�e;�]D��&Qo%A>zgfT�#jyz8�g��F���%Pdb�8��M�9�]��IO�ɦU��D��d��Ҡ[W�����M�M喾;�VP�!�u�%�)�ڸܚ�7Cƻ�?��-���t�1'���,�=Ne�Sj�n��Z�_�ߍ2,�d�ty"d ��|�~��갂��,^���
2� ��������&���
;�[�ySM�l����X�Cş�)���Z54�V?H���&�S&tzN_8�HV�Ƌ~�gg*wS�̫4�$<,~���{HD�m�dg�̦�/!{�G<Hq�~/H٦��n��s�_d<Or}�����[�'iPb=�}�L�����X���[]�"}h��n�KiC/���C����&���� Y�_� k  `ߡ�M��3i�RP��uc�F|MVkM�eΤ���#�+�Ih#<�LO����7��:��d���o�O-�~�����g��� ����[9ލ_���b��j��$�� L����L�*@��A
����N���_Z��Z�Z���rN�פQ� "������)$SN��˿�����P�l];K�g��F�0�C���ꔥ������	��y	F���� �N�/���dJ���G梅4����������1u/��,��6^/��I�y����I ���n;�.B�~�IQַ-��h�ˉJ��[�W���R�Ѳ���W��:���n��3o��,�܇���O�DPG]������kc,1<_�"ɫ��>�Z1K[�I��_��G�S0]��ҙ)����Q��ɟ��[Su�|b�9��nP���d�H�M�,c����$��+�?�����Ye�P���@㗁r�Mﻂ���.��v�*pJ��ݼF(��-�E0=<��|ϡ�f�	�+æG'�b�I�l�T�����#U�����rƤ73I�9�H�>oOk��;=��'�.��Lȳ҅z�?��̷��4"���w��}���NbM�ú{��E뮢�g�s-iyZW�H��_Y��\�"1��c��g��y��lܐ=N�SCv���E�fxm\bO4��]�z��8)
�֖�-���T�#�.�^V�)%���fuc���`�a�J�O�xj������!>u-�C�֋�R�&y:4�?�����<�� �ڢ���T�Ŗy��7t�پ���zh�G������Hl�u����O�m5��K��uޣ�鏀��Eaշuχ�-ӂ�V��fc�k���$�+��uc�_y�Aԇ�)�r����l�v�:�so����J��=���Y��Uw|�f���ж�Z >B�_������a��*�T1!��o�����Y��Ī��:=R?VE���"Ĵ�s_�k�Nbsgy("{B��N\:ꆥ�ô�av���X�7��r��mD� �4N��P ,-��ðj&����)��_%@�M�۽Y����zVD�44��+�k}�B�P)U�Kj����JZ5����f�j�kp�E��ۼy��v��q��+kމ��=��[]�ܙ=ɋ�Ŭ���ҏ'j� -�?�y���Ǭ��EO�O'G
w3Y��S�#��Vz~�~-���X �~���&�?���ܼ���@}�+бr�E\�_W�nؖ��5�f�k�V_Mp������6�2�L Ϡ���Q�X.m�C��r{c������[`��U<~mWο@��3����Z;9��R&�N�Ͳ������)ڀ�+��B����J�>)�n�8�/ml�Bt^2ҏ�Y����$��k�&�B	k�θ���hN��ZW�{Ͻ-�dk'�%�:iI�G�hiE]tLk?���Z���a��ܵ�����9�q_�%�\,�:����sU�4���n�ڏa�ed+�)��Zb$��	U�c4߁�7`��{�~h�Ǿ~t�ʵ��bMK���W�]�W�JKei�b���?����ꎁ}�ׁ��?1����e�+�;��gQ��n��\e� �j!/(�۞5��)�z���S{��*�U�b��%�fO�ǩ���U�z�İ����gv�3��:�J���+��F>����J*�6��	/7���J�bbX�[ф�D���yK�<|�y�@#����I�tڴ�tx�DɛQ|��KS�?�9��^��r�-{~���حc<�J��� F�}�0w��z~���������S)�&�/����zc����!4�k���2�R����5�3�n����ᡨCN��˙�<�����T���oK�붐�G(�t[��J	����� ��HAAk���l�d6&���V��)���aF
uAN0����t�i��h�	�p������w;��)���{�����PO��x�����u�<z��Ux\R���vs�}{$X�
eu��LU&��=Rz�����N�� \�T1_繴����wz����P4�#��[ZtSG�42Á,��������gAQ1��]��U{7!�It�9���=��G��'�I��/X��sy{��s,�㞷
|��Tm����Wns]l+���S�^zZ�ͩb>l���<o��}Ƚdu�`'��Cѡ��=כ"��Tu����3`�<����*@Xطqu�G�%8��)�+΁���@ʺ�I[�6Y�~	��<҅���=������اX����	���b8xN��B)��A����9�b �n�f�W�唿��龈	n�1>�:ca�r�B���Δ��V}�g}
�kmu�E!_o�3��;�n����G�WN�}�A�o
M1����9��N'n����m�sf
?"h�y�\�ë�,="�l����ܬ(����|��s�:/	�z_ϴaO:�^��Ft������ܱN�D�{�DzL&��z�y��<b��X_�2$:��٭��FLBS�`حmߗ�qk���wRt��"s㙤S2O����W:I���lʽՁu�6 D�dl6����x��@GM�Ӻ�be��%�x�׾�D;tF�kL���L�v�K(q�7���/�Y��jB����`�C�*��#���d���\ �ca��;:Kl�P��!�b�~ƙ�:ٝ�9?�(��?��_���{��ʧf�gu;䢮ƞ'yfv2$$�z��� :O�����o/��9�r����C�k�tO��>��$݌���<9�-555-�L⋎����U|jA�Zm\����{���Y��M�4G
��e�-̧-1��Ď� t�,��B�f�[�b۳h��#	��$ʦ��mY��"���9V�����UŠT���ә(i�"E���n�x���3;N�tr*m��ѥ�~jk�6�*�:�ӓ�>��л�a�nb����!��.���J^28sy�ͳt[���i{��������PjҺah`������:�F)��L����vdy�06[��ѳ���f{�I�Te���z�^��h7��l;�:�� 2\: X�]s�3��8�$X���Çdi�^Di�D0�'�
 r�}�����^.�}K�?# �#�f�YfG^0�b#-Fq��'M�ĭ��d�e��W�*�D��@2����̪�� Jóq�i?��W��7�w_��TB�������7�bZ       O   �   x�3�tI��L�����++J�t�M���K���T1JR14R	��5ӫr���*�r.��K	���wq��*���N6�4��Ow�L���2-J���M�4202�50�50Q04�21�22�356164�60�/����� |^'�      C      x�3�2�2�2�2�2�2������� #>�      E      x����vǵ-������3��G�"�-R�	�c��I�4�*�YU�����O8�����s� r��GDd���m�-!�Ȍ�X���TN7��i7l�㾹;������O�_�Nw��������O�[�����W����aN�����x�����w������v���C����N���+�w�o����cc]cS��k�J9�|��4�~3��#j�I�k�6�EP�(6?t�n؟�p"�Q�!x�X�����C����p�	�1�w��&§�ϖ�����Ӧ�cx C������o��7o��4�"K�/�x\���e<���x�ێ�APX 
 ��jS�%��V5�[O�O��|wqHp9�������6���L��ǳ ����i��3��~G<���8����E(�`da~`��:����["\k�����Im���|���zz���
 �w�7��D���~���`R���:$��mp��tOLK�`#T���~��'�˵e�0��E1��pT����k٩r{o���>0ݼ�χ�q$������/\�/���iw���'8��f��p{��>��������p+�&f4*�2���=!�G�8���x>^>
��-Nyx@��UK˨���|;����<\k�VM��ahl�7��q��/���r�-� ���+�Tw#�I/0᫥iE�opn $Ӽ��js���"<�Q����oB��m>v�{��.UNU�ǆ�;��FD����	^H5�IMR*�!�=��m���� ���P @�"X;��0#4��L���W��x^Ҵ%R���i���"��{��O،Lhޞ�n�lE��MB�@,d(@�[�w�~��Ê���!Ƚm�(5?���x��� �T�GI��C���f?w����Ŏ��1�׎�p�r��h}u��vz� "�H|0�	��
�yZ�FC*?���	��_v����#�.�O�4W�v\�]>��k����tCJ�c"��x��˟�p����Μ�V���0�z�(Q���- %M�&q��C���G,�m%����Q��s��������]>]�+�P"]�s��"�����۞$�vp���h�f�|r��R󹟦�^O�I��PDx�\�y��8�-F�? +x$<�w�O�|.�Q},$
�s(��D��v��v�eV@�T�̿d�O��n�:��7gϵ����d�6����(��VD�e^�k�\���i��tz~�F�G�5dʘ7���ʈ�\к�v�7õ@��V�5�uW�i8\u �i����>������W�ᄈ1bp%�@80B�����X�R�%��e^��@lD c�Ԙ����gw�{W#<1��='e�����&��_���p9B��0Mgj��T� ������ݶ�˹?	��pA~hk/q�f�[�.����D/��t����_���!&��b���[j^�u�o�;-6'`�i��Ÿ� �C'�4���X����a<�[��8x�o��
?��R�祭p/���Sxl�[ئ��,nHz��"�`��Y,><xh�)��]�}�$�ep��(���s�|n���@�q���psȟS�)zJp�bɎ����A�v�F�H�*`�p�΍�T�	�k��9�ۓ7?)ئ�ה��z�o'@��+l?� ��6?*�,����Hx��"@�y3u����J�ӢJY��#a*��U���� 'F�~~�8�Z9Ĩ��H�tV`b��<F���x.����j��rVEh\�@@���[w��l��Fў�P� ���aI�F���ՄCQ Mu_�}�q m�v�N���a�B)�X�ģ0��8�_1�=rͷ������� ����a&sݰ �B��<M��8�7�Rb#�@��9J-m�G*�G��FxlÁ}���f��Q�[��`mw��^eݓ���@k��M>�[xp7��;R\0J������h�5�O�@�b-O�Lpt�<�����k�n��Љ��K"'�Y�m�43L�c��	�2��#�x���$�Q[Fc�W�������Sy��ـ���r��� u�N����x\Kڤwy��}��V��x&��|(�1�I"��$�~<�<勫�L�V͞�~sy@���#V8�,�?�O�� �|�Sc=�.����<\13����
g�q��n����� P:�Q>"
x�l?�o�?#"߼~����p���@rJ���H%O�����FH�y�w[�E�*''�}�����#<BH����"�yXCP}���-��e���&���\��ْ/ֱ:T�XD��C���,�*��r�KL�LF`��sw<�?:lZ��>��'�(ē�w�H5X�RN^�kK�X�-������,؊��Y����\�V%��j�o �'��ݵDo�M/�8n�X��D�? �8��Q�D�+�"�^S1������?��ñ����x�rQl�����,���F���Q Dpا�4K��(���x+ӸS�k��C�@ݖ�"��
_���C?���\m��nq�ɜ�pls�m��~/����4�=e��w �����D�1	��"Kl���[��o�<������_dA��b�q�r�Z??	T��jˬ�r�D_L6U����#㩿���oM�5�Hc���0|M������O�(P�k-#�H8�i�Oa� ��oO�,��9�G�;�����Xv���
�I3�x���?<�G��K��i\O��pyDp�Œ�C<�ŭ��E{�6��,Q��- řs�9R!���x�sC Ϣt��2?���x�������j3X@��a��~f8��~����)g��~Q��1���_/ߡW���	]����|����ð�U,�J�B��s���8��C�<\����e)��c�9��������D8�7�>'ބ�᪘i�x�h��$�f�>�P��2[^���q�߸��%6���&O�F�����^i8Ư��t��T`�-j8ވ�˵V�����������;���R�]�U���:lo����l� <.3_�ޜ�\��~;L7��^�m�x!ߚ�yɨ̓*�z����q���r�G7��/��(ps�<��<�����4���;��/�El�i�*�D]��*O'�Y<&G��9�Q|_l�y<�З [��W��[�Gy�� Φ?\�̬J�=� K��X�������t��Πg86o�"!���ޜʹ�0["��Y��4ߞ���~K��+��f9 �b��Z���~�¢g,�t�271sL�v;NBX̌�Un��Mn��ֺ��N���T(�G�$�rͧ�p����Բ���r;j�F��D�صvc��ЎZ��u7u����粴�zQ���`�b	�uw{+@J_��R��b�ܡU"5�n��ڲ:�z�8Ƨ���K�z�
�����c��]B����i�A��$�z�/j�5&�����tףs&�%=�yԔ�(#��ͻqz<���˨��u<����L��e�'��܋��Ǉ-G�сp�^�ϗ�E�܍i�S��gPpA',��lL��`ʶ�湥�%gs�
3��֚g�^.]��T�s�:����TJ�������o��2lV��޽�D<H��/�_�ZWr����Wô;K�~Y�"q��Z�~���,k	����	n�rm6΢�Z���	'ۧ�Wg���c4�������\��U�MHH�� �����@>��������w��w�y��Qi��`��<- ��3����\�GH�T�s�CѺI�F��H�i�=����+��,��U�ԑ�*�t�i�7Qm�:��0v�u�������A>!л�����S�g�4���1p�O��q�/������-*�%dwo�	c�UN�B��
�:
�ixXF5��Cw��|$!�<�&yā�>2D���~{��*:>��,{�%RM�^y|N���D�`��K�Q�"���<�W���xnM;��A�Tk�d`�18�	���h��������Y�ۼ6�^���T:��=�e˱��~��Q)�0�    �ёnh���`�.�	��a��9:��蜦��D�$D�?��3)���;�YFTX�R{ߍo���gX@��Y~I���/D����0�6(�&.Dx����}I��}�۶��H�����,Q�a��|%gQ�`s-�J�vQ1�bB��D�O�}�·��._�M/�J,ݥ�iE�����@B���ͱ:?'�Cf���TK$���}=RW2bγ��"7g�D�y�-�Tb0����~#f����i�r2�p<jS=�ډ�y�~"Mg�ZȆqsH��b�w*�HS�=V�T���S�и���GUV�Nt2$�|B4�� ��F��ך�䧔( #�����n` �ֿ�5��Q��M�h��g���g2k-Nz^6X�CW�6�k㋬�$wKD���� @�vmՔŧ�f�]Cҩ��~�t#�k�T� �:J����!�����m�g�{�>Br��V(b�x�o�;��iӝD̼�s��k�rQh8n��~��/�e.�>_V�&�. ��2����3K�T���H��ф&5?��~Km@i�#lKg�@�$�������vƓ5��p!�>"����{�S���^NυP$2<�$V�*�6�Ӱ�
th�j�P���q8,c��bx8��ڝĒ�%M�F8��2����v��бo��G��ꇢ���l����(� d����@�Br����G�J�/����U��0���'m��'�R�������=�ӵ C�m���D�2l�,'�q�b��4����/|^����1�ޮp\�Ǳ?��������]ٜ%��QYx����Q ;U�Y�I��NV,��V"����^`vK�Ӽ�\uFiIH��~/S��n�x�(�g<�f->�)�Y.�,{�$�8t1�Ch�q|���\�Q���H��$;p�&�Mp���?�D=��c��F�OM#V����&�A0e�Дs���^hL�m�e<�r�`��X�5��e���{�g� #,,z����e��󽱐��7��,�	����S�c�-�k	D0�d��s
��z�f�X�ð���`������+���#R���7G�F�KQ�h�:�F8l
	���|j�H6���CE��m�1��K�AO$���nG���� ��8���Ʉ��"j�P:JÏ����0��od��u�!Vdj��,:�}��1꾗y`~Ɠ-U[6�D��n���:	��+g���,��R��d<�d1�6�˦:ޒ�xl��1�Y��\H@3;`*n���Ϸ���8]>�Ş�7��T�$�A &6�t��Hܚ�5�-��Ń�v#J h�}��J��E��_B����7���$0���S�(������XD	1��?�ǻ�<I R�b��9r���Pֲ���{L��[v�9�+o[K�X���=�#0��E����G��#H�S@�/>����`�G;�/_z	�lL�e�г���S-/��\�$�C�X0q��e������C?�>#�a���_}����ǭD6�T"Kn~�t!�cM��w(D��N"�ѹ�����2N�Z�������o]�*(>Al�.�#������g	"d[ô���ҹhd�C�Q�K���G��/N��K����V'J[:���r��7���M8�,�E?�i>�)��as�Pm�xD�{�X-̀b,%�<R�,����n�B�WP���-g�c'Lu�?������R��Yy `�W�p�	8��䮉�uy��UÁ/���n��E�U9�g��X �4���y7�{����i�"�~jrMO�ǻah�۸)��|'��d�}w��|�a�K��?W�FL�y�M�S'����PlE��y�c-��D�~��I^}�����j �FW���4���\�B��D/�����!<-�����^P�Yo�z���J�GeR�6[�޷5uD�����˄F�97��'	ax�� ����=�F3"�]�Rk�׵�8�dO�l�{tlޏ���@ra���IY3��Ib�hD�p�`���[��9��b�QWT>��G�3ݚJ�4U8�q��Ȳ�h|�no�^@�ޚ�*Rh�Q��s&���������=>���i�˓�T]_���B�_�͗N�Y��b��6[�Oϔ��P�ʟz��u�
�/�xgZ8&6�����dr8�D�X�P�F�B����!�卧I�`!�������˸űگ��n~���^�a�x����(V,D48��E������=&�bV��y`�A3<Edൿ���O{EI���o	75�����Hոe��ސ�A�ͷS'#Qm��v���h(_�;��z5u9x�����@��z:��R��}w=G��nH�PL
daυU�ٳ�Tl~�Nݦ�]>�
��yL��z	q�Pj�c�ͣ�UrHuP�.9�{���(��͏�z��$l��6����oM�!R���$p���Zgù�l6��i�$?�u7�_�2],�z�ɻf<����i'��sٙ�D�\|"�Z	߼Y>.�$|���B�j��Z��lK���'�f�m��y_�TK�KR�f�?Ĵ��t�� O��<5����^�E�u���/"�3�/�����?5��ͻ��ܠNb�	���P8R$ID娊?��E�`��ئ}Ee�k_���9���g��{��	 Z�8p�SE"
���p?$Le�
EQ�Z�)2����1/�Z|)p��6��qY��p!��0+[��!�vcH�+>���
�Y�=ɽ�r���'L3�9�י���i��w�V�J�M8]wWt��F����y)t������l���z�e�,�%ߡD3��Ol�:����. (��N����@�q1�����逼�k��#[�����kթ3���3��v;<?	 2��}Gҕ����C?t_�u�v�s��nJ8��!����^p�P����0�0&9+z��E���p3�E�L�/��xk�(�XED��-�yb�l�U��đ69�ag�G@X���������K�k�Q�H��ܡ��a�v"��a�K{0����΁EH��Jz}���V��Q�A�B�D��Y�|��{�LL��s���<I����
�Gc�n8�$a���H�)M��]�����b�磄g��fƃ�5��
�0x����5!{~��m��Cnކ��CS����R"@��8ǝ���b�g��Nl~|~���x�8��ȃ6E���L%at�m��&�H)ڇ�U�1Đ���V���v��$�����iA'2G4��T$@�y����4�x ,�ܞ�}Q�NB�-����g����7�I�y}>�E�-�����_mn3�A<�h<� d��t?*x�1�hU����p/"'��[�)����̀ez<v�A�?Q�hh�"K1jV�\)$a���8���v���=ޖ��`L��x��&#�Y�ݴ�!�҅E^踿',v���UmyD�օv��zG��Au��\&W�X���a/⣣��*FyOm�/h�o^M���Q�O�_���ǏJ1�& �h
st-���ĒǙ<�8δ��dnO���=�v	B�Ι_`�9WnOʷ��|~�J0��BL��UY�" ��(To���˫꘥�46���i}�������a8�O&k7��E=7?)ۼڞ�i�|KҘژ,��L�,�eV��}w�mD�Y*��kA���݀�qX�����-8V-RO��X�;�R�qw�(a�
+�8K e�Mh`a�5�7�����-Fq�+��4�̫	1�-�F)D�ӗ��uiGzE�L�f�o���m[���T�o]o6�͟Ώ"p��*ȑ�*x�:?2�|:�oޟ�2�^ن+�(�v�bq8EpŰ����z+�M�m��՘�+�7k�>u+4?��&�R�m�p����g��W�8�}�;�Qs�XNHI����PZjN�h�y����H�Hfϖ�W�:lqv� ����Q��/FR��m[��#��p����i�� l4Kqu�wuLj��6@����u��~/Q㍳Y����S�Y�^�o��^h�6;U2�ieπt^A�"Ԩc��Lpy�W���v��3���3��    e�^,����`�x3����XW�~�@���ɒzи��q«	LD&��a�����<�m-� j_�U�?:�URgg�V&a�8��^�j¤W��P�B<FirX��N��u�.rv����&ȩ;M���k�V�|CY�M�F#��6W�n��p�ֵV��.5�T̫�+"�LŎ��{��a��!������f8OG�	���/ު������m��Zծ[�y��f4�$Q&	I�#���|USԱ{��w�� `e�>���6?(�w ,S�;\>\�K���f��|�ҭQQ7�>n�,����h�	�,_xТ	I�hfA?���tr�K+����8�lu��Mɗ�0�C�o�d��]D�2d;�d��K�	J���q���,B�
�]���rGޡ�M͛�xD�E�M3�l��8�����xO�k���ŗm���Œ����>���M	��X:�(ga�%O�kB��:�2B1.�d�H=�GQ#��]w���vI�XP�<VI16- 0��y8ޟT�]Z�xqŀ{]1�8����	�V.�K!�gK���N�����CS��v�ʻ|r����k�N�i8	h��T��I��υ��c��3
R�R�3/���"���Y��eM��N|���|�1���6*��AB�%w�	=C�c1�˟� �K���W�f�W�ψ<���^��|v�����;4�,,|��Pt_Qy	b��0uJP�쵌s��L3�&�s'��b�̇��74*�X���;u���ͯ�ϵ��x�w*�w�fu�	�;�i&{$���R��$,{���$0�n��lcr�}��h	Lj~@��@�e�b�å���Ճ��i��"pZ�vA�34?a���������_1>���l>�Z�|�\˴jli��̕cbO�ݥ,��i8
�t�Z��.l4��'������^�K[�Q��:�u�J9؍��l��k��G:�Q���V��<��a�|�¤P�f�Re��&f4�Af׉Ov�E[6�:��k���$PP�EB����.��o��k���$��y$�T�\��c���_���;C�t�d�?�C,S'�)����h�IYa��+�U%rO[,�5�Ye�&Z[n;�P�����i����2�g���XK���n��v+ ���b�U��������B i�x#0���T�cu�+Ls�{���l�x'Q�u9��E��s���꼽=��?�
3���Ð N ���[xl�f3Co󴂫�E���d��u�Kb,�Q��.7sd
�XNΫ��Z�`��X�>���6��YBge#T�dfAĮ �PK��v��%a��G]��Ñ�#�e]wd;xls5��i��X˭k����2��|��i�w���q�֞ԟ�$��N�
͟��I��$�jLg�Q�z+$������OVq�4��(���^�yS�e������5)�E �*������8�o��m���ܰ�����+�=�ɗ_�n����<eJ�EEP�0ތ�a�~1K�ǂ�?�
K����ԉ����%ffZ<�:O^�2�98��E<�sV8�q��az�M����,D�B���;r�9�ĈF	(��O$]�lO�"��`�u^����W��k��Jp��+ET�5*^
�ҨEA�C�<�DhR�;�:�@���i�[`�+
��V�f�.oy���Rġ;�kJL�*�my?l���d⯤�\Z��?EaZ�f ��ݵ���.C��#��dSG��|�ݡ�P��k��邅��hZ8"�IW�����"�1���� �P`jy��-CB��nz\�R�7�|�c�y��i>?�7�.�Ѥ4�`BVJ��*�"����Ħ�Rad�l򖟗���&���� ��������L	�Iz��o�N=ć)U�7U�B�`��nExpre���D�b��դ3��\��(��N@[�� _BN� ��q(км?���j���'�B"@�r�eG�N��j}e�e�k�J:7V�j��Q��og'ޱiV�]0]���F����E�h�׳-�(1�.��8�����_�`"{9������vus5��z���؛ƥ�Z�R�i�m��@��,l���.��\�H�tĐ6�����'�\~'�f�c��Gg{��c%ØI6>g5Vs�@~�6�Q�]����_����	�1͛�����~n����BV����)6��mƝ�tD��>Ujui�W�¾3\����9�&��%�"��dk,��� 1q�)j)T��c��ּ,��q<�Q�Z�U�xJ7B!���*�߼�ͯ�
XՄE��]��(ň�7ߎ�D��UNE���5S8����	��q����
h��0�$=���A�@ă��n��Y�5'�Y��k�1�R���_��a=����R��]�N���7�@ޟ�L��}<��rv�K��l ����h�!!����Jy�C�ֹa��;6M�^@/5�x�Lla}����ş�~�Q��S��$6���U c�=�9
d�p�N��ץ�B�+�Џ�I +-�ͤ�6s��S�Q�	��N@Kq&�r�=k�TCxV
�	�wF�!������ra���@�ͷ����dFˀkp-��?��>���40\B��O�f��4j�'@�AB"���͈b�BS�|�!:���-�|�|��W�)��� ��M���3\8��&�Ic�s	��|�'�� � �"r�I+����YD��,5M������+�~�!Q��T�	O�4����̐�Z�S�������.����n�I�y���`��6��$���^8���Yf�
�t0<b����s�h3(v=ЅgS�8!8�F���eG<��Wm>&,�AQ#�2�9Ι�;��7/g��@�y�d_���/�sv��
�r%a@.Z�I<0��Cҁu�++Ĭ"�����������m@����~�#�Q!v��^P"�$RI�����:�\|b�dQ��(�/S�������$Pn���B�?G2������j��ö߯nO���Y�?e=EOS�!�����A��jJ
�Q\�;rTF"�p�#�l����'��όxt���$7Q/��'��P��LC��n�-]�W���$ˀl�{�˹�"��Z�L�&��-�Ս�\������`pN�hP���_�1+�^��n/����R�ufup6�vb��]�����$ U����J�,s#Α�2 J��l7㡃_! (��=�
q���l4��d�a"����>�Őc�/�2�G	t�
p�8�?�f���9�'�8��y=w��BL����酾��i��c��4�o'"���>�B�R1��;�I���0
(�[�8����� P�T��:I`k���;�t���DM���<�$4BK� �
�.{
i�A�,)\��"$�Ɩ�i,�B@����m�s�ğ��L�N} �.`�'��e]��b']�B c��G�O�%d}���_�� }7u�AB@�eL�+u �u�� W��M!犠Ei3!�*��f�S�֘���2͟���ІJEv��2�-��ķ�6�~����fe�Bϰ_!T�0_��##�iE�eBK��)k�m7]d\*J�Lf�´�5GD���M"��*.յS��M��p"�|��:q�u\)��2=�h0�;�2`���C��a����f�f�i��W�V�+�[F�;ɼz�~}��
���Ѹ����QSc[d���|�W4����U�4�y�S5�0EE�O8��J����v����A�2�-����`�?bU�V5���Au�|`�	����i�Sw����wQ�BD�q�=�o�m>���^���ۅ]�+P8��4i�||����w�r�����r���\�q�#�v�!X2��ɒI�qjZy��O�����}��区�[�8�ɜt,8�4а�>�&`egg#������5(�j����2H>��{�([��.h9��$(ξ��Xբ��T%T~Ԭi��Y���6T-ܬ�K�?V��r������i>H��:��񺈐,��fe�u=�F�q�l>"�Xh%    P������QB%�0�C钚��O<�y���A���5	�\�˘T�P"��tf�{��Y�ڹ�^������ �'���b�&	�eA��T��پh&�xv.z�"#�xR��q�����q�.�ՕӗO��P�8�Zj����)n @07�M'�F�D�_(4>Dc���0
4�LuV�-'P>jC����Q�4�rKmF�w��,QM6j�J�b�ƙ�Io�"Ì�n'�~�Z,p>X��x�T�7
~��n��$���/G�\
�����1h�uۭ@Pat��,V�K�7±�C�����`�	X|i�;$�4�/��"�`󆓵XJ��G��F��Ѻzn��_��sz`|>�����M�+���2UB�}��H�f7�%�8��e�y�iY!�^��>F|X�ga���j�R�R P�Y�ٺ"9��мz�h
Z N��*l��:���+X?�^@F��Y���ZlLh�H+:%$�PM`�S��bS�yB8h#����t@f>%�߬5@�O�y�O���O�b0創&�TD��J��4o�[�_ ����m��b?Opo.~����l���hA	�80N����\%X����-In�ܑ�	��?I�����"¨����R���Zof��r��H�IC}�|N��Z�>:�XoUPs��/%eT*4�y��v�~��y0�5��V�xifyjh x�ߟ�m����Y �̪D�'ԧT�볂W���q�9�y{��BN��+�+�D��'V�J1`��t�����Z�_�2c�L�g>3�AT�����7��ظ|�2UE]���9�Z���R��v�����z��$��V}������C-kµ(�)(tV����5�6�.�I5��räʤ�Y<��%ԖK��J7��N�.���>;s��E�>�K�L�~+��R�M*t�P�zi�}��4����^K~�Wx?������~u>@ ��0|�x6�n��<� �<m"�^p���¦ϑ��t�i?R�In7a`�IY&����M�����I`�;�)/
L����*��ңB���������z��BOØ�t��2�i^Mݽ@�c)E+U�(�^/͙��'��0I�tT�c�b�5��n�A��?�����S��p��G�ڐ��3{��n$�t,�z��8�v��9��������� �U��i��^^����R��Ub޵(,�bF���Hs�q��x?<
�*�e���ԫ�w�k	=��Sw=	$��U�.!��)8�G���m�?�$�  ��f;�'�K#��:���t�,7K%��$SCW�|�>��m'a��)ב���ͫX*�5��i/���j�e&Zq6_�o���8���Tear�6RM�^rK�����w&pi9���KehJ�8�w}}yY�_n4�R��
r�BkY�2��Y���{\���d�w�MNݰ�b%[��L�p}�B�>L�C/��I�[bASƦ�dK�3* ����@�2-�����`�����ADE:��7|5O���A�m�n��rn��I��������S�]�ՠ�-[ÐX��8ŧ��F�R�+Ⰴ��#�V.d��D��ٸxd����sDQ;�^"��n6b�Ά*���
��]��/5h����9t�;�Y@�	�"8���U&L���[E��_�/���)��l�MI���Ĉ�̘��~���w�˿`17Kǉ"���&�xs�X��o�4B@\/&7����F����6Db�;���FBi���bru�;X�ED���<5�$Ԧy�1\iYsI��8�D����.��Y$��c����!6�F$���P�U3��SFh��I��,��L`���(�?���,�l�
�bJ�<<��x췝@uGe�����R1d2d��5��N��,`��Il����vȄt>�L��0�ow�2���j�I��3���,��	�Om\r����ҫ�
��'����c�6��<6%���9$?X����F	5*��$'��;���HlQxΓ�	lۯ��=����DpE~g�[nl�bЂ�y�tgH�6�͍-�Qj�̽�ӝ4��} Ҿ 7
6���ϓ�3"�ͫ���ID���F��vlm�'W�Nh^=?M�5�/_�s>TD�)Ϟ�y�"&���vCw�	D�����c��ͬ���9�:���f0<�u�S��/�$!w[F�B����XH�E!�vg4j�fA/����8���LYB��5�\<te������4���n�
��`f8���V����z:�z<v9a�²�{h�����B���r�]0[�1"�\7r��}�*�>�K��k�0$ί����v�P
�x�J蕺3����y�:�����Z�R�/?����?<�=��ݾ?	�.��L�j"�A6�f�e���(ѺpQ̀�
H��OVH�s�j����B N�K�f�/�;;<�(9Df�gp�qe�T5ے�a���h� �����z����5?���.��v�o��:��ʁ}�}�(��`�)��эU�,�� �nm�YhM�frE��  ��#�T}}�c�%�S�8�M����ըXc_	�^�ƣA�$g?�/�����%�	Yo��KBϊ� ��ew�?Y��ui�
V�O�������K�.4$�T>�ސ���������̮"����<wf!��w�N��V5tE&�6��N\y�l�C�X�(7��﷟G�j�����n=l$X���qT����6
�"�ؼ�vpTIl~���9���v�*���4\K=3'z����Vp�~:u��F�B��_�j�P���n/"�k�����Ҡ 4���������X⋲N\6�nLBE��E��:�mQ���Z���l�U햌�J~XL�kxx?�M'�`�D؀4B����b���y}�h!鴨�x�9����#�Ar���n��ՙԨ�X��-F4�fB����޾Ppt�΍��AR�U���p���;
H&f�2Im�<�Ϋ��� F7�{?o����}ɋ5�&;x�/�E�"�L;�%�j�?-/aԹ�w�u'ga��iX X�P�Ɂx"���C����XU�T�=NŘ��U����qw��x�B�g�f�y�DUM7�J Gk��V�ĕܲd[��L�����S:	�sˮ��YВٰ{�i�Uj~��n���]�<Z�qyȐw@�d�:5o��v�v�0҆�ձ�j���27� ���aM�TL�%d�q�9�i������R��I`2eֆ�ci��O89��$5��,�����uf��r��64�F�!ǧ�0Hp\�������E(����0����%���'LeT��Iͷ����W���tܬf!3$���~�a˔WM�$x��1[���z;̦[U���"Р%+YF3YF�e�D`�;�-�}Q��#|uNӰ�@�jh��@�?ߙ�|D~�4���,nY
lh�x"D����Ĩ�OĦ9��C7��NR�|x:�g�Ǖ������K��>xj3�vS�>��/V��E��<��t|d�s<�.�'�~�`&59�,��D����0��[WzE�L�Q[\CȌ#.j�4=Y> �h<	cy*�#��XO�_�"x�?-�I�KR��:��;�FyC[��r��1q�W �����(��/��7E3߷��R��FF���RRM�!C�?)0�
�ѡ�z{:H�$̆k�r��W,y1�:�8����V L��Ƀv�U��������[�1����,�ͮ�6�@ ��p��o|gb�DćU�"��Ȏ& �`�*���
^��;ƅ�`�q9X;�<�M�� $7?���Cֻ-�7�-��[ۛ~��nIe��<��kU�X�'��B�-����Bwܪ�z�م�Y_��a��U`T
��8�{c����*Al���v��Y@_�V�2��r���b��A�˙�c(����c�ƵWd@�y�;�"�d��M���XA��j�`W���vs�v�����5_>[+���o��\�JR�Y�c�r˟�I��`  :_�l5i�V�˓=uTH͠������0��5My�_��/�r�~>������"��`<ļe_ا    �#��=�|��y3�q�픘��fDFSE�~?
(����:��F�������n��V��J���c��@Y���<\c�n/�Z�R�U��.{�{�6�k��$�M;��	s,_��'�n���^�MP+d6ǩF�,����n���.%2�=7-��$썟:J���<�M65O�����\�� թ���:V�W�z
���4IL��YN$�t�[��X'eq��,P�K��Ôe��u>!K�L�a�Jg'WcU֔��o�k�oѮ츖��-���{�,f͇��m�ǓD�3@���g)@��L1k�
�Riza��%kK��!R<a� .���l�1q�+��S���Ҹ��S����vQ;AL��cO�vV��j��o|�汁��c�q'���F���1�p����%��p ��cW
���N�OL�<�f�VX�����!�=��6��*~���/},�9h6���I����`a�iH4o�iH����dLj�z�d���ʟ�����S/�k��/�Dn��o�%&84^���k����.�D8RY�eM#E�Փ�{b�5�Rղ�Kt���
�6��uw-`;�$��i�/<	� �7o��|<B�#���]��ע��eHJ���*���l��RT�eiz�Qd���|�{���VD��|��H1��r<�W�a�N��E�|	9(h��>䪞p���t��N»��~P�]S{����#'m�7~���v#���S�bἨ�1���_�P��2^-+�w$q�{Њ��{	>]е�J��� �&�%�-l���yz6�"��8v;<$k�0I0�}i|q�����x�,�I��n��ڧ>�T���S5i���yG� r~�����@�ҿ��q�aǡ�TB"�����n���Qz��O��r�Ќ�pmߺM�� ����eW������C�7�v��h�"����-*��5/m����"��]>�3	U3���F��6���?�6-���Am\Ƭ�H~/h����D�)�6,� Ou��Q�+�m�Kwx~:I0����Y�l�����w�
�J/�ꯜ)x��S�H�y8P��^���J�X4�h�:�
�C����;p*[d��ya�`���~:�U,��2>D��"E�~��k' f��v�2�����q0�-uT��) �?��!L����P,�fJ�CcѨ�M�B2hƻ�(� Nl^c�TB�iɻv�����
�WF����Js��-��HO�IB��/7a[F�;��=�7`�ȱ�:8�)�2-`4���ܘ��<��k���]����Z��T\����]V{!�6�o
j��t"`^�U�$]UD ����"0p�#��Z&��h�98G����`�C�E	>�Z�������7Ul�Y���T��؆*^a�v.|��I#-DH 	d-��
��q�v��Y���_ �C[����x6�p{+�~u�L���B���|����l��82���A0)���F���RͥR�BL�;[Tby���n-1��R���=#�fKv3,��R�y����R�R�Gx�o����M��&�wʆ"蔲#=r����4k���y/�iC���Ae2-�I��(6��'r�t�]gZQ��Av�Z�RN��V�um�ѹ�l�dP�� ��t>
�C��^�m2O��K" �u�~;�O�[�ܲ4Y��X=^V:�	�a?�ޣ~QܶEs�Z���Jl^}9�(���J^�X�gAa��4��pns�9�H�P�����b��R������ �*�4��ZN~�2�]��������-�`����Yt�].'s��6�Q��|����ʎ��,}��,��º��߶�����[�S�߅���o&82��E����h��7�Є�j�M���t��u[��d�D�<r�5�Γ@qG���֜���<j�RF����ۍ�����,˷��/�c`5?��+���:7��L E,�y�����,����i�����q+CG3_��/��e�
��>>N2��=Ksͮ'@>:=J�r(����+vD�{�!L=��ê�q��8d������C7���$P�եuW_�Y��CC�J�%{-̭L����+���p:]�ڴ[ƥ�۟"�|~~�??�J���Y�;,���4�7��),\-g�&��OR���}E���@�Ҙ�hQW*R\����?�'瘅�E�"�:c�h�S����n�I������uuL��LD>�^B��5���E%]�0+��4ǓDXjҌ'��:+š`��q-P�]�n���l@X
�ޠ�����)Zw���Ѱ�	O+�F���������S�֓8O;W �a4C�9��4�qe��X�r?��tq,�>$��ר���M�.lhޞ�Z����T���s9	��fؠ� ���}�rtRȅ�er��-���~�n���&���c�xT�zz$���/dWz�8����)IOɭ���ٌ�^���jD�[����?W
"�O��x�*U{,\��c���]�i~y~���/l*��ʥm��xذ��a�o� �N��ҋ�W���`G?�����(��pJ+�-7��h߼P�]��E�hr6i���>��$�Fr:�/<k�Yj�Z~�O����� q��c�!�!�:9�i|�O�;$�,���W�h{��?���Se(R9wY�����n��w���w	Dj1�ڲ˻ϟ��7��pAa�P�������u�c����p+�O7K)7�}��i���N�����x��ѡ�V*���&�p�>�/�7�g�5�5'������i��{	FS'KM����l�Sw8O�g��ʡX0 ���ϐ[L�����:��ݚ�:��'Ar�k+!��r�^^w*���Hx,ΥO���݂�ŏ��˝Y���<�
�����,��j��k����A�\n�j8�g8���(���ídZ𔖱-���nH�׭�����p��"��6�ܣg=]e�ܣ�d��g�˔0@�m����uwCZ��S�LP8*v-P�/s�e,��*�t'`�(^t�]~�l���h��,�4�H�eחߕM���7e����zs"��}��`��H�̰O"<���\¬���7���w�{�s^�B̾��!ݼ?�(�, G/��n�Y�����p۟�U~�M3�J^fc2xn�{�דX�:73�|W|�Ͷm������n'a���@R�w [����r�]w2��E*��r�n�G�ȩ�<}��6Y,��y	{�%5Og	%Bc�˵�T�b�L"6+�M����%�9t���8���J�s��a}��#Ħ�][�T�[��C��Oh~@]�����lK�Ǟ��į}$ҹ�py���o�a�Y�|v��E�92����7� Z�#�B�fEK�m����:��x�^W,�:3�RޔSn��~4d�r���t�(��?�� u�ܲ��{;���~+!�0��T�|'�3���6t�N�p>���m�T6pY�����q��|�Xx1T2h똝r�����n�����Z��=6�q{9>�M�3�x���JP	�bK���֚�H?�^'��\�Vldb�De�Q<fW޴��q7>���.bk�5	=��A@V�lv�O������ʹ���.��W�GT(D�Jz�.�\@e6,�0���G8U!��҉䦋���������!��|���}ZBg���z�EÛm��)�~)>�
7����F�:�
�Ĭ�E���7!W4^�k��d?#����b9W�X���+^���pGw-�*�~Q-�Z�L|��ZC&�κ"^�Z�V��=����?�D�Cvs�E ���_y�'�pf���\KF0v���}SY��#s��n;Ҙ�T}�:j�&��*耚/���� �.�*S�5��p<V��U����M7	�)C1��������bǳ\(;��7C�_K菪�e�Z_]|'aK�H����2�
�+��0B�}bH���8u7��e�Wi�qk"zT�L,%��>�7�Ee̟j\��>�P����ݶd��e�E�8{������U������K7md��O[���C 	  x��Bq�����80څ�Iv�g=]�����|~�H�6�6�D��AFC�kܖ��u���]�'2)�
i��Y�؃F JZp�Kf���ZX�o�����/c�G����⛁�45?��i+�Iz�z���VF�����p�#��C搰Wk=+�$���U��6�Q��#8&�{Ē(�������-�͗R�*�|r�ۓ4}@���N@#1���f8��g�OH� ��l���X>�������c����|�î?�1��]媘�T�D��q:���S�JA樾�H��&s��PC�����.�S-h�8�7���Sb�7ή!��:i��*�FTC=��@^�ڪ��a�/şH{f��_���6�tU���ҡ�s���a�SC<������a#2@�T��Ǽ˖I�UD�Kkd=��a��e�|��ƓB�_t�MY��qNf�ߌ�X�u"���3' ���ô
m��77�7oV�`]۶tuc�A~�i 
�Bշ�@.V�j,������c���O?��&kI �Y6X��_�J���ռ&�v�Z��lD.Ly�?�#��  �`C�2�����\SP8�f��WzAv�
4�h���ͷ����;K��/s�p2��S��N�i�]'�i�g+Q�e�*W� �_��i�"!u[�=�q�
3)B�� ���J(�t��Rs�!pp�kz<�M��0'bh���ޓ�����"-����Jd����=9�Pj���]�[@�����X1�LN �kޏ�M'�l�r���vuBi��@ t�B�"BU���f����8�=m1u@S�|�F\2h9��6j<�.@�!�)i��(������kؙ<2�r����,�̽!�~=��<�I���U��[�i�t�j�������$����%)Tf�'���^��(�b���f>E=�f���Sw:u���h�R��D%|qa�=z�U�q�n��^ K���o1�2�.�`%}x~ڎ��g��Hr,�O�% �:[��4��2���y��T4h����mln�i�js}���c7I��Q�b�~+�h�x���\�[���l1e-3C��`>M�����|��W�-���\1�p�����!�bLQ����2+/ׇ~;�'�U���L�/���?�4�-�V��?�kO;[h�d�G��|K4��-N茰�����3�q���O4�GD�y���?����y��F�(�C�<I��H����/�C˓���z���'8R�g����罀%�SaQH	��*�'��7'"���Ah���%��	��mO��qX�"��ֽ̜8O'2�@��q�yy'��kHJf�\"p4�β���A�u7%��"*�ul���wG�*�p=I<�"�n��w�9��π�P��[�uSS��)�&���k���6C�^��!Fv��2LȐ_%�]���7�G�g�
c�v>�5��vieaW|�m�Ȓ�7��S���u!��)��ǻq����7�.*��b�����q:JP�N���i����\��A��k���M|˜J�WPb�i<v׏CT�Ǘ�"�Aͮ
(u}�	�	M�j���@�ܮ�`���$��c�$��*��2W�b�q,�/�����f_�lu����5%T#�(�U��0V!�ͧ��o����UNQ����+�"��J�S��:�BZ�F,�, Ct�j�/�����pi��B�t?\�q���w���^��T�煡���R(/��:3s�ؤ=L��^�ꙧ&J�!�o�b!����I"N�b���WH;vF�\�JF�_���5�g����w)KF_>��J���C�m�l����ͰF��˓u^P�I؍�Z<�z�͢��D���ƴ�[M�b+�9z;��!����P�*�+��W��h��T��b2��,��V��sw>9KD讝_n�Pٴ���)��ý5�1n1��b��2� �/�5bRb�'Z7g����f/g!�X�xL/�6p����`Of�t[�Cħwg�)?~K��"hf��`��A5��BXԌ%��eW���!���S�"�D�2�-S��2��Lg�
N03���㊾
��B�������M����q�O`Zg>t�n��<�!���Yn�I��@R���N��é���4��?
��B�"怸�*�*D,��|������lO����n�J�5ᅙA�m��\+@�v�m�	4�]�a_e���9�
��=R�ђեՄ"�M8�EbjE�`\u���M��ÿ� c�Ժ��9�u���Z��?g1�      F      x�=�ٵ,!��3� �/����Ώ��4Ŏ�����j1>�����>)��<��o�j�r��~���[�H^d��k�d���ܱ$C�X�-�;��Eˍ�Or�\q%�e�!9[ދ̳�����n�i�1[~#��I�N�X�y��Y�rIsIs}$���/��u�$�X�������-)�Eܽ�$��H�s
��Q�;��~+�[�U*[�%��w:�;���1[�q$Q����Dy.�gYH��5%W�Z)I�^��_� �4�_t�!�F��-�e���b�?�o\I|rOIR��_�ώ�-�;&�1���Igɉ��|�|��2$��вB�I�[*V*V�OrH��^u���'9��!�y ��It��g}����%���OR�5%WJ*:�׉~� ��D#�;6�3�3�RsK��PX��1hȉk!�ϰg�P�Zk�)��xTz#��4���1����i,p��������T�,]�c��w�3�OAw*P
��3�����T�Ö�5�X���aaW��ugl�=�
������Ҭ���~c���ra{��~*(H)����*�G�D2�6&Cl�{zcS���C�\9ÐJmEG�G����x�)�0��#�^�4�����0�丆�ն'ߍx�J���^�X��F;�o&r[����g�^�x.i̙�bEJ�|�HCa�ٝ�9��̥��1E�J�mC��t:$M���T��ʯ��!��Ӑ�������������aL@��q�Q�І;�P��J�9C��u��ʯ��J���k<�ˉfw�ۄN>\У���H�N��o�1���s��)���������F]Ci���c+��.��4��B�Bܹ�c(z�T�I�R*��_�����T����$l�(�;��t�DB��&ݻ��Ӓ)��PU=�~����>�)�2B�>$8,!�J8�X�8�ǋkǋ/��4�7�e(�3�,�d����y�3�!��c�0���PXR�ƒ
�;xHn��C7h� ��yN��{\Cη��+�V>�������`ǸFv	������
���1�
k:a�ot/^=x�$&0{� aly���� �o	W��x���P�Q�r�X@(���~���\����,L#��<Y��nԂ"�Q*{Nc���/���Q�+\8`~���������l{��	yV*B֥��ewb䐜H��B%Lc�s���،i`*:�hpv���eM�]����\ǞǞǞN%\�p�b�
c�%Cal+��!W�e��PF?��o� �X��ɍ�t���$�=�iHw)��g7p!E�x%�y��rY[�b*�8���a�8�5�P~�AAnC.1��IF۽lk!,ȵh��E��o�T
��j	=�Ø`��{��S\c�l�8=+�"���ˤOrHN�%H6o��t�Ow�t'Oo��;��֚��g(��rjuM�����D�(�ɍL�������C��m�*�S�i�vE�\g�7�	�zP�{�8C��7��J�,r�+�U����^.R��G�N,X[-@��[��M�}�0��fX��(8l+�8��4����%G	1u6 �x�(S��X�V����e����4��l�(���aLcJ�K�D!87	��Y�0��������/yr�{���?B���1�]��0�q4����6J�����`es���+����H3�,[��<iA��;.RNif)���*G'�^�\$��؅
C��q�������P}Ra�	=hH]��J�mH�n�*�`σ�Â�pjȫ'�}E��^�~��_�����*e�,�u�	�BP�+�>F�đ>��(��4�y�1F����.O�]�����Cr�'�ӭ�%�k�nٵ�܎�hݠ��D>�r�i���*�ɓ�0�����iϜ�{)5ʏ�r�m�U��즆��n��>Ø��8e�K�tp���a��bӹ}
�}�A����G�3� ���TF�R��s�k*�0�X�O��e�uGؽ�+� ��C���#��XL�9`�.Ż�����O�Z��A�� ���iWHSqi*G��Oir|"(��VN��3�ae3�8����VS�����Ͳ`o-��#�9�e(,��˽5�6�M�s�PXRg[G�{k'Lv�H�G���^�=���3����H���|�ךw+���Si���0 [�}��j��䩊f�S[���j(^:^:^��x�y��ǭ�a�t��kRX����qX��tg
$�3�\#�'��qV��Zr1*�.�:� ��i�yzip*-(N��qF�f�$��W2���L9�����>8��*�8i9>i9>ii�n.�2�P~yV�5��P*a�J��C���њ�k=\�����-b!ƞ�s���9�9����i�5�1���0�ʡD`��a�!�gC*��ʽջ�#�#M�.������\=	Ø�)_(%�Ie�\&(����\J�3.��!//�T�S�5>C��zw+D!�N�.Z��]��e��mQ�A.�@l��T�p-����5�����.后��e.��2����^����9^��H0���+���;l�c�)Lc/L9��ʞ�lo��RF�.�mȳ>�WC�Ք����nG� K�9���K��f@�0n;O�ZS؆����a(ך�C'��w?N��]l9��t7wwh
�q~�G����L�ߴ�AI(�kt-^6K�Pt&�;�>�S[�;]����@A��=��������r!����LHC�Jvk!L��x��n�����ȅi,a_C�ۚg(�{�c�W�s��:���eŇL$�ܗ"��W2����V<q�N؄%P�d1q�ܒCrJ.�@�	LB���%q�g<�R<N�t7~�5�d"���
�0@�Jp���r%��#���Pچ	�}XF���iA�g<(:(\���	r ��唉 8�Ƅ+t���B���#LcalC���F!�ʐ��P*�x�x�ђ�$w08��*}�ND�'�`@�K7��]�e��
����w�5�0��5�v6B��0��|��!�n�r�,��
��g9R)ώ����\㠰@.��__�_�e�h.�pz����R�f���0�	X��p�4�y�=i��J-Wj�/?�8T��x\�ԧ����3)�6kh��Q����p�'H�06�o��q ��]jj).,��D��<)�ⴣ��G! ���
ܤ�������u#RaQrqB]>�i�Tһ�4��l��6�^����E��|`LH�!=�(j�R8�z�,Lc!�ⱥ)oi��ۯ.�n�Drk \�<�5�B��u�q�d҉�cmӠ��֫X2H���ـ56���ky!��bG��J&�5J�%�[���$`|���a�!�9���)K��!\�n�Z=����\ʓ�}�_��O����ϗM�������z|�y�D��!g��yn��L�'���x��_�2������,����-�}�~����R�[������|K�A�{q;�Pz=�b� ���#b>>�mfks<Ns>���-2�����̀��N�����`B����:��20�|*YR��{���>:���4��Ԉ����X����wm�eսo�?�C�*'��x폑�Hp���K[#}iˣ�W̦�X�|e+*q��s0�'�5�z��g|q�j�����pY��?�r�`S(A�@b�2����ޖiا-��!-u���mV0�e!��=	�,z�X:�i�5eJ�������Z���<&�Z�EJ�~���P�BG5�~�|������������ҿݺ�2�c<nS����p�|\�ֿc>�?����U����t�Jt1����O�W7<�����G�3�����FJ�?�K���4e�W�ˁ�����n,��o<�G�]}Ԓ��8��������r[?��h�,��+O��zY��8Eα������)z�&���|���y�^PO�i�|z�/�t�>����x��R04ۛ%�B��h=�ʢ��0;�0+���RAJ�Y��_�|��Ö΢�f��O�}�|�9 ���5�̭5��]��7��S�����'~_����t�s��u�φk��������vk�C��Ӱ@
��� +  '�$����2Q���AT��N�����Qٮ�5�Z��xt��M���^6O�q>�\Y��tU�<�;��������K�x��1MFj�z�8u7��A=,}��}�r�^wv���~;D��sCY�������de��+b40b��)L-����*q>Z_S�xSd���P	,��1&������ ��vA��g4�iАmP>:�K7ȣ ��������~��S���xg:�,���\�2�5햁���9�����#����9�2����Fյeg����e2���L���:�X[XWʸd�K��&��&�8f>>���4s`��H��� �L�X� 3���h}��#j��͉�|z/��N���3��<��'�C��/#�0�/ٟ��i2�ct ��ɶ�lƵ�<p1��a.���%r�m�G���4��4ٯ��ӹ9ףˡ5��x���gG2bY�!�� �,�SKg��	�����M�Ĳ7w��v�v|>��c���?�LSͧWNWK8�c��s��,��˗K;������H!T�ooo��nW�~�<����)�1u0�IAKn���yU�ǏJ�)�5��X���]�@���:\e�&C�K)�:Q_�Gs0��8������y�Ϭ,5��#�!S�+4�4�~(��y���U�KB����@�G�ǚa<s1ϣ�5N�[�$'�G��˯^~���8A8l�00S�Ì��*QzK��0^�������c=-D��G3ף�aZڡ�;��ߡ#z�Y@����ø"^cځ�}p�ސ��yt�Իω,��_`(���{�����fx�G���X��zG�O���/����϶� R�zn5>�yAn_L�m��+�S�����z�|���zz3�������t~~ʓ>�۾�4C���^T��k��Z�[	�������ڮ��=Z_�q�|�	S�-���e���XD*s������aj�7�� `�A-�Ov�r��̂������:�=�#��|U.��b�ܮ��=���Fq����M���B�S�����M���q��J]}��1E���h�C=qK���.��-�kA�?�r0��YZ\�!b�f:��'�����w���-����v���Q�x�\f�xz��������x��2�m2�\�����x���k�OB�o����9n[i��2i���?�W+��(>z�S콲>4�ɶ�b[�L�2���e]z���s����.By�6|$��3�@j�
��G��<��6q؟Evkd����XZd�6zp������ܧ�?+�v��+X�����3��Y�ߥ�ߥR�{f�z(>��ǥ�N)���=!�r�Oc��|۫x]��T����8 ^=�[2�1��k!c�wC�7C��7oX��Wz�9�[Ω��2y��?��N��G#t;9��'�_��ON�x���q�uǣݴ��Q�x�wx����lv>���<��|,1�������;���ɜG�k ;����5١Lv��F�U��,��)^�j�`��kl�y��N_;�.;@�粱��M����k��wA�����|_vHz57�����w6�0��#�n���2��w����g�4z<N���r��^��]����S;��Yw��ex���k=��cNԋ>�
yǍ����خ��w��;�����ޣ5'�f���d��=1n�>L��wi91r�;����-���qwb������:��/�'��3v��<��|,q|���a��Qf	�q>��x�bG<����|��U�;�m��.�H�!<W��?u������Oˣ��s��M]N�)�+�Y�_�]*����YTd(+������� ��\      G   �  x�]�Ov�0�ףS���t�Ei���A9�6JG�9r�jFvM��7?�{#F�v?���wS�0��,�����A5�}��w "�<$��v���)͛�rQ�ޭ�?)8S�IҺ&���*ic�5�<�,�a���e�)�o��R��}E\@�Q��,��pJ�2�� pNZ�UiTU��Z�U�"�jQ�4Ɯ(Ō�5��%�1�a�y��LLCx�%�2T�)��G�#���~�!a��<�]�)�q��t���<{~�'�s��>��JG�t��t��^��q��b��<�5S������S�O��+�Y�eԈ�)Bf�4!�E���"K��G?%������8Q��� ���>\����R�&Њ9C�ˍ����1�A�J      H   �  x�E�Y��6��ŤD��^��u��v�\Wm
'��z��Oo�o��7��w���l������v��v���_�uza�C��m=|�>xD������Gm�3��-��+�Alch�m�gj�x`�y`{x`{y̖�&�f�<���-����sj�4�s��19�����m���F�_�цK�N�	V���_�%U�]�Ʃw��Ow���3��f�����g
�q�2�p�m�\Ru�RG����?���>m��ٓ��e�kH+v[�޾�]Ұ����H��J�ݯd���-}wH��8�xX���o�S�m/i]�n�D٩6�b=qv;�4�m�K}�vB:J)��ΐ�%H�5�%���-���n��VS����a�!���!��7%���=�Sp���k� ��#U�+ѓfiH]�o�O���+��hw6S��K�������߉�(��U�����p���k|��9���)j˺��g��	7��Q��][Զu��o�!����6�;��:�N��6$zܝl�F�5~��9�b9 ��r@z���3R?�=m�H��:h�v�4V;���O�s�X�H҃����֦?��ô�}pl&@��a�~WQ�X��98����� Ѐ�GX�y�;�ߑ�z�h���e�mu����c�:����*���24A 
�}�dT�}��� ��8C��c�e�=�����2�n<��ԿB��hX�"��A�d^ȃ�)��A��/6Їtb6�@F!�
d$"����x�D"��� Y�<������!Z�~G�ɼ�Ԝ�@-4xY,r��Ρ֕��A�-�!`N�� ���-��.[���:�%�C������]��M �N*૲��e0le�c�D9,j�*�E�'��T�x�u�������#E�X`�R̥��p��h��ql%��	.�|��*D��C	3�[iSUа������`xP\=��\����j���.�!�/_F-$����:�@=��z:������Z����`Yh��8l�<�����VCW2I�(p欈1����B;��A���^��2M[ׇ��ƕ�8�#\1(v��]b+�hu�����t�|�c�_:���\�X��TUQŒ�/��r>����(���Ĳ
"Lb��l4�h(�g�����W  ���=�Jщe�!���jk !���H��?L	� DB��L}��7��!ھ^�1�ڞ�+Z��F;�Ւ�8�0�`z�b��EF����3e�x@E�i��"�2"mw�q������ᆈx\�I "S�k�1�m��$Fʺ�.a��x�}�N�Ѐ�B�D5,�"`1|�Cؚ"��f��m�HI�F/�����M��g���qzѥ��h���Q"�{/wV��p�ޠ���k��-&ɛ^�D0خtH�A��!���J���!�[�|H�Ư�S���K�[��[�5�EA��W���e��6��-�n�>-E��4��%ZO�3���- jMp�9�v���ZJ�L��{.�4��n�a�CXDAV�Ӈ���|�t�k��Pf��)2��Ʋ�|C��$DMb#�h�hkV��6r�ԀѬ��Z�[���0`���(�+����[H"������(������䚅\Cr�2p�ˊ��jpD%:�ͩ�J��"�t���[d4��HhA�����a���[�2�!���F����@�5"�j�)��,Z���)�"�X��)��*�-��d�V&�j�B#Yb|��\׷���[�e`|\���+)��=0���ሟ�+�Z&�q �B�é��e�[���Z�@9j�����rh���v�5���&0P�&�mb(��Q����m��o��h�����?[�<�o�j�tx��E:��< {|��<��k��S���Fݯ�w���`9�y�by��lmg��H�C��!D�m^�E���d�+#b1�����"���V�0�B��� ����z�E���\��Sl���Ok�?���      B     x��Mn�0���chm���&)�)��Ȧ͂�eY�,���(z�ޤ9�/V�r$`�<�(#+�I?ϛ!�A��5��S����͝��$|87N���w�|����W�ҰZ�>]�x.i؋fPkS� �Z�FY��4�Z�E=ȸ|N�e��Lj��$�\)�6m
��E����@����Zsl��&�w\�h���D�`���]\�8Z)eR���R���C�}�dM�o�{�5���N�fB=X���󿒧������!�]��I�j��R��KYsL����)�� �B����7E'C��ttJ;�OFħ>e2*6e�I:e�9|�6�@P=����g3Ũ�sr(#b�d5k�T��b�C�d;Y Z,�M) ��wT�dz4�Wq���!�A�pXʥ�A%U�dZ(��n_�R�9��a
�fzk�^��$l��,7���ss.VP�]Z椳si�/��M۹�9�<;(����v�TdJ�}uW��L�ȥ$�t��"�&s(6�&G��0�Q�pu=�&�p�%���#�(\�QBŗM��f�$�.iv����v�|"�Wp�S�Ҹ�ԙ�3MD��TS��f�2qv���-2����MvNqҎ:9�K�T��(.�-zWO���zC�Ȁ
�:!�����NH�qcG�9�E�+��G�n��}��G�p�M��=�臦.�,��F`�N��t�i�"o+��Ȼ�	̶!��\�$��Q/!���sItai��l���,�1��M'(5��!aZ"��Ľ�l�dQ�������%�@      K     x�u�ɖ�����S�fwU@4t��"b���L��E���y5���0�o��� ѽ*O���}���Ԏ��i�':����a��|�::>�!׈>6��.4^��9mx��&�5�����xmT���/����7���g�Y���h�����|Zg�p�F�{1�%���YX .گ�l*\��>卭xH'X,�:T��̚\��}���9���op�~�K��Rb�J&�D	
j����#�d.}��D�I\Jfҿ��>M�:�����k��54v�ݔ7��!�X�?�&�wk�x��U�>3�H/���n�����d;���Y �@@+�� �� |�%�f�L= �2[��˄��� ��:1�Z�o8��"��<���/{���c����~���3ټ�&n�����܀�P������i����c�v7hV�:QS�s�ol҇Lr�8��p�˾���8����	VH��q���N�&^�:�L�P��~�М��j1;9�8���1x_�O>�G�x��>�=S�8�t�W��:Z�^jl㕩γ��D���׍,;i��|r�gJ�s�9n��̂.�4���}������?��L`��¢ue��d�v�aF��8ക���&�g�T�^xGt�`�b�ᮠ�k�/ß%�b3%���+���P2�_��Y����R�|
0�^n��f��
���4�B����	�Ty�3�W�i0��!��M���Ќ*�4h�K<ۭ�n"D%'�J1NC��#�a�7~�;�{Mx�������w�N-��ց��U��7�G73��<S���'yI�������z7n\ӀA�c�`w�Et�����Dt���p�ei�m�{=���V�,A��G����5Km��|w[� ���:�����;E'p
��~ѹS�\��Lw"ɰv����, 13��4{�l!�/�c)qR�ѣ�S��7��C�G0��,y� />�N��ĕ�1Y*���rhl����2e+��v9���u���l_��df����K���D��U��� `���U|/���k%/��,�"k��B�H���í�IJ%��i:3P��ʾ/xg��h����v��aL��q�`��I=Wv�ϟ�b1l��ǹ�
��Cr˶@d~x<�9c�*�*�d��ٕ�*�z�+j�q�;������|@:�	��6\���`�me�<�Q8^�F�"�X*�ή`�[:Wm��|�G��[~����o�]ץ��O�i�7�C���pggo0��%�lf,���k=l���#��4b=�|���������;�kZ���X襉Tvx��F���/�y=�+�:�����$��4�N�8�iho�Sˣֶp������/6�Q2t�� ��Y'�=�����,QdŽ��Y7���3Sb��fx��)R{�W!�Fް��̿AԧQ���<��N`���vo��Y��ޞb��AI�y���H��k��)�AqvV���HE5����������4b?ot�zM�U��+���i��lq��d\/�v��J�S����1�t&r]��rD��
=����FB���X�>Ѹ�7��(=)Ar'�B������nJ/^����0���X6��jScgG=��>��~C��0D�,��#�����NQW�������Zյ|?�V���va{�f�gJ3w+O���)����EP.������]�Е��*�����P��d���kΙ�9]�Z���x��x��/�v���\��\]e�����G~����N�O@`� <:�_��Ǐ� ���      L   0  x�-�ە�0C��b���a�e��c�U~�����y[\k`߶.�AL���M�	j65tH�7�\6�ֆL)lpyml/��qDT���)��P�g�65,I���b���:�|��H��x��(:��6'�C$�1ka��F%FJ���3��T_�H�eSr6}G��h8�Hr4�р%�Z��.�r�p(�V��Q���R�3Iw��Z�K���������c)�����r{oup��k��yf�3z�ʯ+Aj娌��<x�!Y5"�d���7�dݎċ���Z��z0�-P�ߑ���}��s߀�     
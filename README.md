# POKEMON TEAM BUILDER BACKEND

## Decsription

This is the backend for the Pokémon Team Builder app. It is built using Node.js, Express.js, PostgreSQL, Axios, and a deployed version is available on Heroku.

The purpose of having a backend in this project is to simplify and optimize the data retrieval and processing for the frontend, as well as provide additional functionalities not directly available through PokeAPI.

The backend performs dynamic seeding of its own database with information obtained from PokeAPI. This ensures that the backend has a local and optimized storage of Pokémon data, tailored specifically for the needs of the Pokémon Team Builder app. The data stored in the database is structured and formatted in a way that optimizes the retrieval and processing of information.

In addition to the database, the backend implements a cache server that stores formatted Pokémon data. This cache server serves as a caching layer between the frontend and the database, improving the performance and response time of data retrieval operations. By storing pre-formatted Pokémon data in the cache, the backend reduces the need for repetitive and resource-intensive data processing for each request.

The backend also handles complex operations such as generating random teams of 6 Pokémon and providing complete teams of 6 Pokémon. These operations leverage the optimized data in the database and utilize efficient algorithms to ensure accurate and diverse team compositions.

By combining dynamic seeding, optimized database storage, cache server implementation, and advanced data manipulation, the backend enhances the overall performance, speed, and user experience of the Pokémon Team Builder app.

## Installation

Torun localy , clone the repository and run npm install to install the dependencies.
install sqitch 
Then, create a .env file and add the following variables:
DATABASE_URL=your db url
PORT=your port
create a postgres database 
initialize sqitch with the created database
then run `sqitch deploy` to deploy the database


to populate the database with pokemon data, you can use the seeding.http file in the root directory. First, you need to seed the generations and types.

## Usage

To run the app, run `npm start` in the terminal.
or `npm run dev` to run the app in dev mode.
The app will run on `localhost:3000` by default.
a
## Routes


|route | controller | method | description |
|------|------------|--------|-------------|
|/api/pokemon|api/pokemon/pokemon|GET|get all pokemon|
|/api/pokemon/:id|api/pokemon/pokemon|GET|get a pokemon by id|
|/api/pokemon/type/:id|api/pokemon/pokempon|GET|get all pokemon of a type|
|/api/pokemon/gen/:id|api/pokemon/pokempon|GET|get all pokemon of a generation|
|/api/pokemon/ability/:id|api/pokemon|GET|get all pokemon with an ability|
|/api/pokemon/:id/abilities/:id|api/pokemon|GET|get all ability of a pokemon|
|/api/pokemon/:name|api/pokemon/pokempon|GET|get a pokemon by name|
|api/pokemon/type/:id/:id2|api/pokemon/pokempon|GET|get all pokemon with 2 types|
|api/pokemon/imnune/type/:id|api/pokemon/damage|GET|get all pokemon immune to a type|
|api/pokemon/full-random|api/pokemon/pokempon|GET|get a random team of 6 pokemon|
|api/pokemon/resist/type/:id|api/pokemon/damage|GET|get all pokemon resistant to a type|
|api/pokemon/resist-immune/type/:id|api/damage/pokempon|GET|get all pokemon resistant or immune to a type|
|api/pokemon/complet-team| api/pokemon/complet|POST|get a completion for a team of 6 pokemon|
|api/seeding/all|api/seeding|GET|seed all pokemon|
|api/seeding/:id|api/seeding|GET|seed a pokemon by id|
|api/seeding/generations|api/seeding|GET|seed all generations|
|api/seeding/types|api/seeding|GET|seed all types|
|api/seeding/abilities|api/seeding|GET|seed all abilities|
|api/seeding/abilities/:id|api/seeding|GET|seed one abilities|
|api/seeding/pokemon_has_ability/:id|api/seeding|GET|seed association table|
|api/type|api/type|GET|get all types|
|api/type/:id|api/type|GET|get a type by id|
|api/type/imune/:id|api/type|GET|get all types immune to an other type|
|api/type/resist/:id|api/type|GET|get all types resistant to an other type|
|api/type/weak/:id|api/type|GET|get all types weak to an other type|
|api/type/resist-immune/:id|api/type|GET|get all types resistant or immune to an other type|
|api/type/resist/types|pi/type|POST|get all types resistant to a list of types|
|api/user/signup|api/user|POST|create a new user|
|api/user/login|api/user|POST|login a user|
|api/user/logout|api/user|GET|logout a user|
|api/gen|api/generation|GET|get all generation|
|api/|api/index|GET|link to the api documentation|
|/api/cache/all|api/cache|GET|set individual cache for all pokemon|
|/|website|website/index|GET|home page|
|/login|website/admin|POST|login an admin|
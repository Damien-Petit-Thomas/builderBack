# POKEMON TEAM BUILDER BACKEND

## Decsription

This is the backend for the Pokémon Team Builder app. It is built using Node.js, Express.js, PostgreSQL, Axios, and a deployed version is available on Heroku.

The purpose of having a backend in this project is to simplify and optimize the data retrieval and processing for the frontend, as well as provide additional functionalities not directly available through PokeAPI.

The backend performs dynamic seeding of its own database with information obtained from PokeAPI. This ensures that the backend has a local and optimized storage of Pokémon data, tailored specifically for the needs of the Pokémon Team Builder app. The data stored in the database is structured and formatted in a way that optimizes the retrieval and processing of information.

In addition to the database, the backend implements a cache server that stores formatted Pokémon data. This cache server serves as a caching layer between the frontend and the database, improving the performance and response time of data retrieval operations. By storing pre-formatted Pokémon data in the cache, the backend reduces the need for repetitive and resource-intensive data processing for each request.

The backend also handles complex operations such as generating random teams of 6 Pokémon and providing complete teams of 6 Pokémon. These operations leverage the optimized data in the database and utilize efficient algorithms to ensure accurate and diverse team compositions.

By combining dynamic seeding, optimized database storage, cache server implementation, and advanced data manipulation, the backend enhances the overall performance, speed, and user experience of the Pokémon Team Builder app.

## Installation

To install this app, clone the repository and run npm install to install the dependencies.
Create a PostgreSQL database and execute the queries provided in the db.sql file to create the necessary tables.
To populate your database, create a .env file and add the following variables:


```
DATABASE_URL=your db url
```
Then, you can use the test.http file. In the seeding section, run the following requests:
```
### seed all generations
GET {{local}}/seeding/generations

GET {{local}}/seeding/types
### seed all types



## seed all pokemon
GET {{local}}/seeding/all
```
Make sure to define the local variable in the test.http file.

## Usage

To run the app, run `npm start` in the terminal.
or `npm run dev` to run the app in dev mode.
The app will run on `localhost:3000` by default.
a
## Routes


|route | controller | method | description |
|------|------------|--------|-------------|
|/api/pokemon|api/pokemonController|GET|get all pokemon|
|/api/pokemon/:id|api/pokemonController|GET|get a pokemon by id|
|/api/pokemon/type/:id|api/pokemonController|GET|get all pokemon of a type|
|/api/pokemon/gen/:id|api/pokemonController|GET|get all pokemon of a generation|
|/api/pokemon/:name|api/pokemonController|GET|get a pokemon by name|
|api/pokemon/type/:id/:id2|api/pokemonController|GET|get all pokemon with 2 types|
|api/pokemon/imnune/type/:id|api/pokemonController|GET|get all pokemon immune to a type|
|api/pokemon/resist/type/:id|api/pokemonController|GET|get all pokemon resistant to a type|
|api/pokemon/resist-immune/type/:id|api/pokemonController|GET|get all pokemon resistant or immune to a type|
|api/pokemon/full-random|api/pokemonController|GET|get a random team of 6 pokemon|
|api/pokemon/complet-team| api/pokemonController|POST|get a completion for a team of 6 pokemon|
|api/seeding/all|api/seedingController|GET|seed all pokemon|
|api/seeding/:id|api/seedingController|GET|seed a pokemon by id|
|api/seeding/generations|api/seedingController|GET|seed all generations|
|api/seeding/types|api/seedingController|GET|seed all types|
|api/type|api/typeController|GET|get all types|
|api/type/:id|api/typeController|GET|get a type by id|
|api/type/imune/:id|api/typeController|GET|get all types immune to a type|
|api/type/resist/:id|api/typeController|GET|get all types resistant to a type|
|api/type/resist-immune/:id|api/typeController|GET|get all types resistant or immune to a type|
|api/type/resist/types|pi/typeController|POST|get all types resistant to a list of types|
|api/user/signuo|api/userController|POST|create a new user|
|api/user/login|api/userController|POST|login a user|
|/|apiController|GET|home page|
|/api/cache/all|api/cacheController|GET|set individual cache for all pokemon|

// ---------Routers-------------------------------------//
// POKEMON ROUTER

/**
 * GET /api/pokemon
 * @summary GET all pokemons
 * @tags POKEMON
 * @return {[Pokemon]} 200 - success response - appllication/json
 *
 */

/**
 * GET /api/pokemon/{id}
 * @summary GET a pokemon by id
 * @tags POKEMON
 * @param {number} id.path - id of the pokemon
 * @return {Pokemon} 200 - success response - appllication/json
 */

/**
 * GET /api/pokemon/type/{id}
 * @summary GET all pokemons by type id
 * @tags POKEMON
 * @param {number} id.path - id of the type
 * @return {[Pokemon]} 200 - success response - appllication/json
*  @return {ApiError} 400 - Bad request
*  @return {ApiError} 404 - Not found
*/

/**
 * GET /api/pokemon/type/{id1}/{id2}
 * @summary GET all pokemons by two types id
 * @tags POKEMON
 * @param {number} id1.path - id of the first type
 * @param {number} id2.path - id of the second type
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/pokemon/gen/{id}
 * @summary GET all pokemons by generation id
 * @tags POKEMON
 * @param {number} id.path - id of the generation
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/pokemon/imune/{id}
 * @summary GET all pokemons with no damage from a type
 * @tags POKEMON
 * @param {number} id.path - id of the type
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/pokemon/resist/{id}
 * @summary GET all pokemons with half damage from a type
 * @tags POKEMON
 * @param {number} id.path - id of the type
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/pokemon/resistOrImune/{id}
 * @summary GET all pokemons with half or no damage from a type
 * @tags POKEMON
 * @param {number} id.path - id of the type
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/pokemon/{name}
 * @summary GET a pokemon by name (case and accent insensitive)
 * @tags POKEMON
 * @param {string} name.path - name of the pokemon
 * @return {Pokemon} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/pokemon/full-random
 * @summary GET a random team of 6 pokemons
 * @tags POKEMON
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * POST /api/pokemon/completion/suggestion
 * @summary GET completion suggestions for a pokemon team (6 pokemons)
 * @tags POKEMON
 * @return {[Pokemon]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

// ------------------generation router-------------------------//
/**
 * GET /api/gen
 * @summary GET all generations
 * @tags GENERATION
 * @return {[Generation]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

// -------------typedef------------------------------//

/**
*@typedef {object} Pokemon
*@property {number} id - The id of the pokemon
*@property {string} name - The name of the pokemon
*@property {number} gen - The generation of the pokemon
*@property {[string]} typeName - The name of the type of the pokemon
*@property {[number]} type - The id of the type of the pokemon
*@property {string} sprite - The sprite of the pokemon
*@property {number} hp - The hp of the pokemon
*@property {number} attack - The attack of the pokemon
*@property {number} defense - The defense of the pokemon
*@property {number} specialAttack - The special attack of the pokemon
*@property {number} specialDefense - The special defense of the pokemon
*@property {number} speed - The speed of the pokemon
*@property {object} damageFromRelations - The damage from relations of the pokemon
*/

/**
 * @typedef {object} damageFromRelations
 * @property {number} id - The id of the type attacking
 * @property {string} name - The name of the type attacking
 * @property {number} damage - The damage of the type attacking
 */

/**
 * @typedef {object} ApiError
 * @property {string} message - Error message
 * @property {string} name - Error name
 * @property {object} infos - Additionnal informations
 */

/**
 *
 * @typedef {object} ApiError
 * @property {string} message - Error message
 * @property {string} name - Error name
 * @property {object} infos - Additionnal informations
 */

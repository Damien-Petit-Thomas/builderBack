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
 * @typedef {object} Type
 * @property {number} id - The id of the type
 * @property {string} name - The name of the type
 * @property {string} frenchname - The french name of the type
 * @property {Array.{object}} damagefrom - The damage from relations of the type
 */

/**
 * @typedef {object} Generation
 * @property {number} id - The id of the generation
*/

/**
 * @typedef {object} User
 * @property {string} username - The username of the user
 * @property {string} password - The password of the user
 * @property {string} email - The email of the user
 */

/**
 * @typedef {object} Token
 * @property {string} token - The token of the user
*/

// ------------------error handler-------------------------//

/**
 * @typedef {object} ApiError
 * @property {string} message - Error message
 * @property {string} name - Error name
 * @property {object} infos - Additionnal informations
 */

/**
 * @typedef {object} ValidationError
 * @property {string} message - Error message
 */
// ------module.exports------------------//

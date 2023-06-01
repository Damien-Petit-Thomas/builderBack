// ---------------user router-------------------------//
/**
 * POST /api/user/signup
 * @summary create a new user
 * @tags User
 * @param {User} request.body.required - user info
 * @return {string} 201 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
  * @return {ApiError} 404 - Not found
 */

/**
 * POST /api/user/login
 * @summary login a user
 * @tags User
 * @param {User} request.body.required - user info
 * @return {Token} 200 - success response - appllication/json
*/

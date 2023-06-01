// ------------------type router-------------------------//
/**
 * GET /api/type
 * @summary GET all types
 * @tags TYPE
 * @return {[Type]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/type/{id}
 * @summary GET a type by id
 * @tags TYPE
 * @param {number} id.path - id of the type
 * @return {Type} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/type/imune/{id}
 * @summary GET all types with no damage from a type
 * @tags TYPE
 * @param {number} id.path - id of the type
 * @return {[Type]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/type/resist/{id}
 * @summary GET all types with half damage from a type
 * @tags TYPE
 * @param {number} id.path - id of the type
 * @return {[Type]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/type/weaks/{id}
 * @summary GET all types with double damage from a type
 * @tags TYPE
 * @param {number} id.path - id of the type
 * @return {[Type]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * GET /api/type/resist-imune/{id}
 * @summary GET all types with imunity or resistance from a type
 * @tags TYPE
 * @param {number} id.path -id of the type
 * @return {[Type]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
 * @return {ApiError} 404 - Not found
 */

/**
 * POST /api/type/resist/types
 * @summary GET all types with resistance or imunity from a list of type
 * @tags TYPE
 * @param {[number]} request.body.required - list of type id
 * @return {[Type]} 200 - success response - appllication/json
 * @return {ApiError} 400 - Bad request
  * @return {ApiError} 404 - Not found
 */

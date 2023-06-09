module.exports = class CoreDatamapper {
  tablename;

  constructor(client) {
    this.client = client;
  }

  /**
 * Count the number of rows in the table of the model instance
 * @returns {Promise<number>} - The number of rows in the table
 */

  async count() {
    const count = await this.client.query(
      `SELECT COUNT(id) FROM ${this.tablename}`,
    );
    return Number(count.rows[0].count);
  }

  /**
 * retrieve all rows in the table of the model instance
 * @returns {Promise<Array>} - The list of all rows in the table
 */
  async findAll() {
    const result = await this.client.query(`SELECT * FROM "${this.tablename}" ORDER BY id ASC`);
    return result.rows;
  }

  /**
 * retrieve one row in the table of the model instance by name (case  and accent insensitive)
 * @param {string} inputData
 * @returns {Promise<object>} - The row in the table with the name given in parameter
 */

  async findOneByName(inputData) {
    const result = await this.client.query(`SELECT * FROM "${this.tablename}" WHERE UNACCENT(name) IlIKE UNACCENT($1)`, [`%${inputData}%`]);
    if (!result.rows[0]) {
      return null;
    }

    return result.rows;
  }

  /**
*create a row in the table of the model instance
*@param {object} inputData
*@returns {Promise<object>} - The row created in the table
*/

  async create(inputData) {
    const fields = [];
    const values = [];
    const placeholders = [];
    let indexPlaceholder = 1;
    // we use Object.entries to iterate over the object
    Object.entries(inputData).forEach(([key, value]) => {
      fields.push(key);
      values.push(value);
      placeholders.push(`$${indexPlaceholder}`);
      indexPlaceholder += 1;
    });
    const sqlQuery = {
      text:
        `INSERT INTO "${this.tablename}"
        (${fields.join(', ')})
        VALUES (${placeholders.join(', ')}) 
        RETURNING *`,
      values,
    };
    const result = await this.client.query(sqlQuery);
    return result.rows[0];
  }

  /**
 * retrieve one row in the table of the model instance by id
 * @param {number} id
 * @returns {Promise<object>} - The row in the table with the id given in parameter
  */

  async findByPk(id) {
    const sqlQuery = {
      text: `SELECT * FROM "${this.tablename}" WHERE id = $1`,
      values: [id],
    };
    const result = await this.client.query(sqlQuery);
    if (!result.rows[0]) {
      return null;
    }

    return result.rows[0];
  }

  async delete(id) {
    const result = await this.client.query(`DELETE FROM "${this.tablename}" WHERE id = $1`, [id]);
    return !!result.rowCount;
  }
};

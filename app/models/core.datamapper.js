module.exports = class CoreDatamapper {
  tablename;

  constructor(client) {
    this.client = client;
  }

  async findAll() {
    const result = await this.client.query(`SELECT * FROM "${this.tablename}" ORDER BY id ASC`);
    return result.rows;
  }

  async findOneByName(inputData) {
    console.log(inputData);
    const result = await this.client.query(`SELECT * FROM "${this.tablename}" WHERE LOWER(UNACCENT(name)) = LOWER(UNACCENT($1)) ORDER BY id ASC`, [inputData]);
    if (!result.rows[0]) {
      return null;
    }
    console.log(result.rows[0]);
    return result.rows[0];
  }

  async create(inputData) {
    const fields = [];
    const values = [];
    const placeholders = [];
    let indexPlaceholder = 1;

    Object.entries(inputData).forEach(([key, value]) => {
      fields.push(key);
      values.push(value);
      placeholders.push(`$${indexPlaceholder}`);
      indexPlaceholder += 1;
    });
    const ssqlQuery = {
      text:
        `INSERT INTO "${this.tablename}"
        (${fields.join(', ')})
        VALUES (${placeholders.join(', ')}) 
        RETURNING *`,
      values,
    };
    const result = await this.client.query(ssqlQuery);
    return result.rows[0];
  }

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
};

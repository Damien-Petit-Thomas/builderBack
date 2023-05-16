const CoreDatamapper = require('./core.datamapper');

module.exports = class UserDatamapper extends CoreDatamapper {
  tablename = 'user';

  getOneByEmail = async (email) => {
    const user = await this.client.query(
      'SELECT * FROM user WHERE email = $1',
      [email],
    );
    return user.rows[0];
  };
};

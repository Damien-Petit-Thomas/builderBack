const CoreDatamapper = require('./core.datamapper');

module.exports = class UserHasFavorite extends CoreDatamapper {
  tablename = 'user_has_favorite';
};

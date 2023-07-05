const websiteController = {

  home(_, res) {
    res.render('home');
  },
};

const adminController = require('./admin');

module.exports = {
  websiteController,
  adminController,
};

const websiteController = {

  home(_, res) {
    res.render('home', { title: 'Team Builder' });
  },
};

module.exports = { websiteController };

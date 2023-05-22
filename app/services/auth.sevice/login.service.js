const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {

  async authentify(user, password) {
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      ip: user.ip,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  },

  async getUser(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'Authentification failed' });
      return; // Arrête l'exécution de la fonction
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user || user.ip !== req.ip) {
        res.status(401).json({ message: 'Authentification failed' });
        return; // Arrête l'exécution de la fonction
      }
      req.user = user; // Stocke les informations de l'utilisateur dans la requête
      next(); // Appel de next pour passer au middleware suivant
    } catch (err) {
      res.status(401).json({ message: 'Authentification failed' });
    }
  },

};

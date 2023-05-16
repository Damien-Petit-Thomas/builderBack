const jwt = require('jsonwebtoken');

module.exports = {

  authentify(user, ip) {
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      ip,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  },

  getUser(token, ip) {
    if (!token) return null;
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user || user.ip !== ip) return null;
      return user;
    } catch (err) {
      return null;
    }
  },

};
// const jwt = require('jsonwebtoken');

// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: 'Token not provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // stocke les informations utilisateur dans l'objet request pour les utiliser dans le middleware ou le contrôleur suivant
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// }

// module.exports = verifyToken;

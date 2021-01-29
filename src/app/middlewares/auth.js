const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ error: "No token provided" });
  }
  const parts = authHeader.split(' ');
  if (!parts === 2) {
    res.status(401).send({ error: "Token error" });
  }
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).send({ error: "Token Malformatted" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send({ error: "Invalid Token" });
    }
    req.userId = decoded.id;
    return next();
  });
};
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

// AUTHENTICATION -- identity, who you are
const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        next({ status: 401, message: `token bad: ${error.message}` });
      } else {
        req.decodedJwt = decoded;
        console.log(req.decodedJwt);
        next();
      }
    });
  } else {
    next({ status: 401, message: "wat? no token?" });
  }
};

// AUTHORIZATION -- permissions on what the user has
const checkRole = (role) => (req, res, next) => {
  if (req.decodedJwt && req.decodedJwt.role === role) {
    next();
  } else {
    next({ status: 403, message: "you have no power here!" });
  }
};

module.exports = {
  restricted,
  checkRole,
};

const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(400).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.APP_KEY);
      return next();
    } catch (e) {
      req.user = undefined;
      return res.status(400).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  }
}

module.exports = {
  checkToken: checkToken
};

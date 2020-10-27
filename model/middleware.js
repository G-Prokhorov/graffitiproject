const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESHSECRET;

function withAuth(req, res, next) {
      const token = req.body.token;
      const refreshToken = req.body.refreshToken;
      if (!token) {
            res.status(401).send('Unauthorized: No token provided');
      } else {
            jwt.verify(token, secret, function (err, decoded) {
                  console.log(decoded);
                  if (err) {
                        // res.status(401).send('Unauthorized: Invalid token');
                        jwt.verify(refreshToken, refreshSecret, function (err, decoded) {
                              console.log(decoded);
                              if (err) {
                                    res.status(401).send('Unauthorized: Invalid token');

                              } else {
                                    const token = jwt.sign({ email: decoded.email }, secret, {
                                          expiresIn: '1h'
                                    });
                                    const refreshToken = jwt.sign({ email: decoded.email }, refreshSecret, {
                                          expiresIn: '7d'
                                    });
                                    res.json({
                                          token: token,
                                          refreshToken: refreshToken
                                    }).status(200).send("All ok");
                                    next();

                              }
                        });
                  } else {
                        res.status(200).send("All ok");
                        next();
                  }
            });
      }
}

module.exports = withAuth;
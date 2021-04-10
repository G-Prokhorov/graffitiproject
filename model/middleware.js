const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require("./userdb");

const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESHSECRET;

function withAuth(req, res, next) {
      const token = req.body.token;
      const refreshToken = req.body.refreshToken;

      jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                  // res.status(401).send('Unauthorized: Invalid token');
                  jwt.verify(refreshToken, refreshSecret, async function (err, decoded) {
                        if (err) {
                              res.status(401).send('Unauthorized: Invalid token');
                        } else {
                              const check = await searchInBd(decoded.email);
                              if (check) {
                                    const token = jwt.sign({ email: decoded.email }, secret, {
                                          expiresIn: '15m'
                                    });
                                    const refreshToken = jwt.sign({ email: decoded.email }, refreshSecret, {
                                          expiresIn: '7d'
                                    });
                                    res.json({
                                          token: token,
                                          refreshToken: refreshToken
                                    }).status(200);
                                    next();
                              }
                        }
                  });

            } else {
                  const check = await searchInBd(decoded.email);
                  if (check) {
                        res.status(200).send("All ok");
                        next();
                  }
            }
      });

}

async function searchInBd(email) {
      try {
            const user = await User.findOne({ email: email });
            if (user.email) {
                  return true;
            }
      }
      catch (err) {
            res.status(401).send('Unauthorized: Invalid token');
            return false;
      }
}

module.exports = withAuth;
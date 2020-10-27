const User = require("./userdb");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESHSECRET;

async function login(req, res) {
      const body = req.body.data;
      const { email, password } = body;
      try {
            const item = await User.findOne({ email: email });
            const result = await bcrypt.compare(password, item.password);
            if (result === false) {
                  res.sendStatus(401).send("Incorect passwor or email");
            } else if (result === true) {
                  const token = jwt.sign({ email: email }, secret, {
                        expiresIn: '1h'
                  });
                  const refreshToken = jwt.sign({ email: email }, refreshSecret, {
                        expiresIn: '7d'
                  });
                  res.json({
                        token: token,
                        refreshToken: refreshToken
                  });

            }
      } catch (err) {
            console.log("Error while login new user, " + err);
            res.sendStatus(500);
      }
}

module.exports = login;
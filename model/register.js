const User = require("./userdb");
const bcrypt = require("bcrypt");
const saltRounds = 10;



async function register(req, res) {
      console.log(req.body);
      const { email, password } = req.body.data;
      try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            await User.findOneAndUpdate({ email: email },
                  {
                        $setOnInsert:
                        {
                              email: email,
                              password: hash
                        }
                  },
                  { upsert: true });
            res.sendStatus(200);
      } catch (err) {
            res.sendStatus(500);
            console.log("Error while register new user, " + err);
      }

}

module.exports = register;
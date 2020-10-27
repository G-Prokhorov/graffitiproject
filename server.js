const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const DataPainters = require("./model/painterdb");
const User = require("./model/userdb");
const Cloud = require("./model/aws");


const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESHSECRET;
const fileSize = 500000000000000000000000000000000000000000;

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
}));
app.use(cookieParser());

const saltRounds = 10;

app.post("/test", withAuth, (req, res) => {
      res.send("lmao");
});

app.get("/ping", (req, res) => res.send("pong"));

app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "build", "index.html"));
});




app.get("/api/db", async (req, res) => {

      try {
            const item = await DataPainters.find({});
            res.json(item);
      } catch (err) {
            console.error("Error while read DB, " + err);
            res.sendStatus(500);
      }


});

app.get("/api/painter/:id", async (req, res) => {
      try {
            const item = await DataPainters.findOne({ nick: req.params.id });
            res.json(item);
      } catch (err) {
            console.error("Error while find item, " + err);
            res.sendStatus(500);
      }
});




const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: fileSize } });


app.post('/upload', upload.any(), withAuth, async (req, res) => {
      let nick = req.body.nick;
      nick = nick.toUpperCase();

      const data = {
            tag: "",
            works: []
      };
      console.log("start");
      await Promise.all(req.files.map(async (file) => {

            if (!file) {
                  res.json("You may be not upload some file");
            } else if (file.fieldname === "tag") {
                  const filename = Date.now() + '-' + file.originalname;
                  const fileContent = file.buffer;
                  data.tag = await Cloud.uploadFile(fileContent, filename);
            } else if (file.fieldname === "file") {
                  const filename = Date.now() + '-' + file.originalname;
                  const fileContent = file.buffer;
                  data.works.push(await Cloud.uploadFile(fileContent, filename));
            } else {
                  console.log("WTF");
            }
      }));

      try {
            const item = await DataPainters.findOne({ nick: nick });
            if (item && !data.tag) {

                  if (item.tag !== null) {
                        data.tag = item.tag;
                  }
            } else if (item && data.tag) {
                  if (item.tag !== null) {
                        Cloud.deleteFile(item.tag.key);
                  }
            }
      } catch (err) {
            console.error(err);
      }


      try {
            await DataPainters.findOneAndUpdate({ nick: nick }, {
                  nick: nick,
                  $set: { tag: data.tag },
                  $push: { works: data.works }
            }, {
                  upsert: true
            });
      } catch (err) {
            console.error("Error while update file, " + err);
      }

});




app.post("/deleteWork", withAuth, async (req, res) => {
      const key = req.body.key;
      const nick = req.body.nick;

      try {
            await DataPainters.findOneAndUpdate({ nick: nick }, {
                  $pull: { works: { key: key } }
            });
            Cloud.deleteFile(key);
      } catch (err) {
            console.error("Error while update file, " + err);
      }
      res.redirect("http://localhost:3000/addmenu");
});

app.post("/DeletePainter", withAuth, async (req, res) => {
      console.log(req.body.nick);
      const nick = req.body.nick; // MUST BE req.body.nick
      try {
            const item = await DataPainters.findOne({ nick: nick });
            console.log(item.tag.key);
            if (item.tag.key) {
                  await Cloud.deleteFile(item.tag.key);
            }
            item.works.map(async (item) => {
                  await Cloud.deleteFile(item.key);
            });
            console.log("all ok");
      } catch (err) {
            console.error("Error while read db, " + err);
      }
      try {
            await DataPainters.findOneAndDelete({ nick: nick });
      } catch (err) {
            console.error("Error while delete painter, " + err);
      }

      res.redirect("http://localhost:3000/");
});

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

///////////////////////////////Login & Register///////////////////////////////////////////////

app.post('/api/register', async (req, res) => {
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

});

app.post("/api/login", async (req, res) => {
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
});

app.post('/api/checkToken', withAuth);
///////////////////////////////Login & Register///////////////////////////////////////////////

app.listen(8080, () => {
      console.log("Server started on port 8080");
});
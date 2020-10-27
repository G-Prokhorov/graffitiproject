const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require("cors");
const app = express();
require('dotenv').config();

const DataPainters = require("./model/painterdb");

const withAuth = require("./model/middleware");
const register = require('./model/register');
const login = require('./model/login');
const deletePainter = require('./model/deletePainter');
const uploadPainter = require('./model/upload');
const deleteWork = require('./model/deleteWork');

const fileSize = 500000000000000000000000000000000000000000;

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
}));



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

app.post('/upload', upload.any(), withAuth, uploadPainter);

app.post("/deleteWork", withAuth, deleteWork);

app.post("/DeletePainter", withAuth, deletePainter);

///////////////////////////////Login & Register///////////////////////////////////////////////

app.post('/api/register', register);

app.post("/api/login", login);

app.post('/api/checkToken', withAuth);

///////////////////////////////Login & Register///////////////////////////////////////////////

app.listen(8080, () => {
      console.log("Server started on port 8080");
});
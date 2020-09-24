const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer')
const cors = require("cors")
const app = express();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');


require('dotenv').config()



const secret = process.env.SECRET;
const fileSize = 500000000000000000000000000000000000000000; 

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(cookieParser());



mongoose.connect("mongodb://localhost:27018/Painters", {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true})

      const PaintersSchema = new mongoose.Schema ({
            nick: String,
            tag: {key: String,
                  link: String}, 
            works: [{key: String,
            link: String}]
      });




      const saltRounds = 10;
      const UserSchema = new mongoose.Schema({
            email:String,
            password:String
      });
    
      
      
      const User = mongoose.model("Users", UserSchema)

const DataPainters = mongoose.model("Painters", PaintersSchema);



app.get("/ping", (req, res)=>{
      return res.send("pong");
});

app.get("/", (req, res)=>{
      res.sendFile(path.join(__dirname, "build", "index.html"));
});




app.get("/api/db", async (req, res) => {
      
      try {
           let item = await  DataPainters.find({});
           res.json(item)
      } catch (err) {
            console.error("Error while read DB, " + err);
            res.sendStatus(500)
      }
          
   
});

app.get("/api/painter/:id", async (req, res) => {

      try {
            let item = await DataPainters.findOne({nick: req.params.id});
            res.json(item);
      } catch (err){
            console.error("Error while find item, " + err);
            res.sendStatus(500)
      }
});




let storage = multer.memoryStorage();

var upload = multer({ storage: storage,  limits: { fileSize: fileSize} } );
app.post('/upload', upload.any(), async (req, res) => {
      let nick = req.body.nick;
      nick = nick.toUpperCase()
      
      const data = {
            tag: "",
            works: []
      }
      console.log("start")
      await Promise.all(req.files.map(async (file) => {
           
            if (!file) {
                  res.json("You may be not upload some file")
            } else if (file.fieldname === "tag") {
                  let filename = Date.now() + '-' +file.originalname;
                  let fileContent = file.buffer;
                  data.tag = await uploadFile(fileContent, filename);
            } else if (file.fieldname === "file") {
                  let filename = Date.now() + '-' +file.originalname;
                  let fileContent = file.buffer;
                  data.works.push(await uploadFile(fileContent, filename));
            } else {
                  console.log("WTF")
            }
      }));

      try { 
            let item = await DataPainters.findOne({nick: nick});
            if (!item && data.tag === null) {
                  if (item.tag !== null)  {
                  data.tag=item.tag
                  }
            } else if (!item && !data.tag) {
                if (item.tag !== null)  {
                      deleteFile(item.tag.key)
                  }
            }
        } catch(err) {
              console.error(err);
        }


      try {
            await  DataPainters.findOneAndUpdate({nick: nick}, {
                  nick: nick,
                  $set: {tag: data.tag},
                  $push: {works: data.works}
            }, {
            upsert: true,
            });
      } catch(err) {
            console.error("Error while update file, " + err)
      }

      });

      
      

      app.post("/deleteWork/:nick", async (req, res) => {
            let key = req.body.key;
            let nick = req.params.nick;

            try {
                  await  DataPainters.findOneAndUpdate({nick: nick}, {
                        $pull: {works: {key: key}}
                  });
                  deleteFile(key);
            } catch(err) {
                  console.error("Error while update file, " + err)
            }
            res.redirect("http://localhost:3000/painter/"+nick)
      });

      app.post("/DeletePainter", async (req, res) => {
           let nick = "PIXEL"; // MUST BE req.body.nick
            try {
                  let item = await DataPainters.findOne({nick: nick});
                  console.log(item.tag.key);
                  if (!item.tag.key) {
                        await deleteFile(item.tag.key);
                  }
                  item.works.map( async (item) => {
                        await deleteFile(item.key);
                  });
                  console.log("all ok")
            } catch (err) {
                  console.error("Error while read db, " + err)
            }
            console.log("here")
            try {
                  await  DataPainters.findOneAndDelete({nick: nick})
            } catch (err) {
                  console.error("Error while delete painter, " + err)
            }

            res.redirect("http://localhost:3000/")
      }) 



//////////////////////////Cloud servise//////////////////////////////////////////////////
var AWS = require('aws-sdk');
const { resolveSoa } = require('dns');

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

const s3 = new AWS.S3();



async function uploadFile(fileContent, fileName) {
      const params = {
            Bucket: "graffitiproject",
            Key: fileName,
            Body: fileContent,
            ACL: "public-read"
      };

     let result = await new Promise((resolve)=>{s3.upload(params, (err, data)=>{
                  if (err) {
                        console.log(err);
                  }
                    resolve(data.Location);
                  })
            });
      return {
            key: fileName,
            link: result
      }
}


function deleteFile(key) {
      
      const params = {
            Bucket: "graffitiproject",
            Key: key
      };
      s3.deleteObject(params, (err, data)=>{
            if (err) {
                  console.error(err)
            }
        });
   
    

}
 


//////////////////////////Cloud servise//////////////////////////////////////////////////

///////////////////////////////Login & Register///////////////////////////////////////////////

app.post('/api/register', async (req, res) => {
      console.log(req.body)
      const {email, password} = req.body.data;
      try {
           let salt = await bcrypt.genSalt(saltRounds);
           let hash = await bcrypt.hash(password, salt);
           await User.findOneAndUpdate({email: email}, 
            {$setOnInsert: 
                  { email: email,
                  password: hash } 
            },
            { upsert: true });
            res.sendStatus(200)
      } catch (err) {
            res.sendStatus(500)
            console.log("Error while register new user, " + err)
      }
     
      });

app.post("/api/login", async (req, res) => {
      console.log(req.body)
      let body = req.body.data;
      const {email, password} = body;
      try {
            let item = await User.findOne({email: email});
            let result = await bcrypt.compare(password, item.password);
            if (result === false) {
                  res.sendStatus(401).send("Incorect passwor or email");
            } else if (result === true) { 
                  let token = await jwt.sign({email: email}, secret, {
                        expiresIn: '1h'
                      });
                  res.json({token: token});   
            }
      } catch (err) {
            console.log("Error while login new user, " + err)
            res.sendStatus(500)
      }
});

app.post('/api/checkToken', function(req, res) {
      const token = req.body.token;
      if (!token) {
            res.status(401).send('Unauthorized: No token provided');
          } else {
            jwt.verify(token, secret, function(err, decoded) {
              if (err) {
                res.status(401).send('Unauthorized: Invalid token');
              } else {
                res.status(200).send("All ok")
              }
            });
          }
        }
    )
///////////////////////////////Login & Register///////////////////////////////////////////////





app.listen(8080, ()=>{
      console.log("Server started on port 8080")
});
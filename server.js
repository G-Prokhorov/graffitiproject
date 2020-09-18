const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer')
const cors = require("cors")
const app = express();



app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(cors({
      origin: 'http://localhost:3000'
}));



mongoose.connect("mongodb://localhost:27018/Painters", {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true})

const PaintersSchema = new mongoose.Schema ({
      nick: String,
      tag: {key: String,
            link: String}, 
      works: [{key: String,
      link: String}]
});

const DataPainters = mongoose.model("Painters", PaintersSchema);


app.get("/ping", (req, res)=>{
      return res.send("pong");
});

app.get("/", (req, res)=>{
      res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/test", (req, res)=>{
      res.json({
            text: "Hello"
      });
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
console.log(req.params.id);
      try {
            let item = await DataPainters.findOne({nick: req.params.id});
            res.json(item);
      } catch (err){
            console.error("Error while find item, " + err);
            res.sendStatus(500)
      }
});




let storage = multer.memoryStorage();

var upload = multer({ storage: storage,  limits: { fileSize: 500000000000000000000000000000000000000000 } } );
app.post('/upload', upload.any(), async (req, res) => {
      let nick = req.body.nick;
      nick = nick.toUpperCase()
      
      const data = {
            tag: null,
            works: []
      }
      console.log("start")
      await Promise.all(req.files.map(async (file) => {
           
            if (file === null) {
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
            if (item !== null && data.tag === null) {
                  data.tag=item.tag
            } else if (item !== null && data.tag !== null) {
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
                  if (item.tag.key !== null) {
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

///////////////////////////////test///////////////////////////////////////////////

///////////////////////////////test///////////////////////////////////////////////




app.listen(process.env.PORT || 8080, ()=>{
      console.log("Server started on port 8080")
});
const DataPainters = require("./painterdb");
const Cloud = require("./aws");

async function upload(req, res) {
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

}

module.exports = upload;
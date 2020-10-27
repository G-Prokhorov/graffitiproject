const DataPainters = require("./painterdb");
const Cloud = require("./aws");

async function deletePainter(req, res) {
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
}

module.exports = deletePainter;
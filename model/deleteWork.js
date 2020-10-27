const DataPainters = require("./painterdb");
const Cloud = require("./aws");

async function deleteWork(req, res) {
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
}

module.exports = deleteWork;
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27018/Painters", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const PaintersSchema = new mongoose.Schema({
      nick: String,
      tag: {
            key: String,
            link: String
      },
      works: [{
            key: String,
            link: String
      }]
});

module.exports = mongoose.model("Painters", PaintersSchema);
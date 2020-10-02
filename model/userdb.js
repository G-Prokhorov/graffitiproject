const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27018/Painters", {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true})

const UserSchema = new mongoose.Schema({
      email:String,
      password:String
});


module.exports = mongoose.model("Users", UserSchema)
/////////////////////// IMPORTS //////////////////////////
const mongoose = require("mongoose");

/////////////////////// SOURCE CODE ///////////////////////////
const userSchema = mongoose.Schema({
  userID: String,
  list: Array,
});

module.exports = mongoose.model("saveData", userSchema);

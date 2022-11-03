/////////////////////// IMPORTS //////////////////////////
const mongoose = require("mongoose");

/////////////////////// SOURCE CODE ///////////////////////////
const guildSchema = mongoose.Schema({
  guildID: String,
  guildPrefix: String,
  aleatory_mode: Boolean,
});

module.exports = mongoose.model("guildData", guildSchema);

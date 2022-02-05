/////////////////////// IMPORTS //////////////////////////
const deleteGuild = require("../models/deleteGuild.js");

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, guild) => {
  try {
    await deleteGuild(guild.id);
  } catch (e) {
    console.log(e);
  }
};

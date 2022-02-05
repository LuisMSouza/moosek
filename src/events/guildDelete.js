/////////////////////// IMPORTS //////////////////////////
import deleteGuild from "../models/deleteGuild.js";

/////////////////////// SOURCE CODE //////////////////////////
export default async (client, guild) => {
  try {
    await deleteGuild(guild.id);
  } catch (e) {
    console.log(e);
  }
};

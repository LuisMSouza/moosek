/////////////////////// IMPORTS //////////////////////////
import guildData from "./guildData.js";

/////////////////////// SOURCE CODE ///////////////////////////
export default async (guild) => {
  try {
    const serv = new guildData({
      guildID: guild,
      guildPrefix: ".",
      aleatory_mode: false,
    });
    await serv.save();
  } catch (e) {
    console.log(e);
  }
};

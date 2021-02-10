/////////////////////// IMPORTS //////////////////////////
const guildData = require('./guildData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (guild) => {
    const serv = new guildData({
        guildID: guild,
        guildPrefix: ".",
    });
    await serv.save();
}
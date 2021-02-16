/////////////////////// IMPORTS //////////////////////////
const guildData = require('./guildData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (guild) => {
    try {
        const serv = new guildData({
            guildID: guild,
            guildPrefix: ".",
        });
        await serv.save();
    } catch (e) {
        console.log(e);
    }
}
/////////////////////// IMPORTS //////////////////////////
const guildData = require('./guildData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (guild) => {
    try {
        const serv = new guildData({
            guildID: guild,
            guildPrefix: ".",
            aleatory_mode: false
        });
        await serv.save();
    } catch (e) {
        console.log(e);
    }
}
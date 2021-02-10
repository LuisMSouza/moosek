/////////////////////// IMPORTS //////////////////////////
const guildData = require('./guildData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (guild) => {
    await guildData.findOneAndDelete({
        guildID: guild
    });
}
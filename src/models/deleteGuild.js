/////////////////////// IMPORTS //////////////////////////
const guildData = require('./guildData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (guild) => {
    try {
        await guildData.findOneAndDelete({
            guildID: guild
        });
    } catch (e) {
        console.log(e);
    }
}
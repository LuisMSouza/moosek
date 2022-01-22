/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (text, channel) => {
    await channel.send({ content: `\`❌ ${text}\`` });
}
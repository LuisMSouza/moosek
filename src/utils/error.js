/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (text, channel) => {
    let embed = new MessageEmbed()
        .setTitle("Ops...")
        .setColor("RED")
        .setDescription(text)

    await channel.send({ embeds: embed })
}
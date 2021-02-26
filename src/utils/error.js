/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require("discord.js");
const emj = require('../commands/letra').execute

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (text, channel) => {
    let embed = new MessageEmbed()
        .setTitle(`${emj.emoji_2} Ops...`)
        .setColor("RED")
        .setDescription(text)

    await channel.send(embed)
}
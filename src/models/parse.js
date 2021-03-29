/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (channel) => {
    let embed = new MessageEmbed()
        .setColor("#701AAB")
        .setDescription("```fix\n" + `${process.env.ID}` + "\n```")

    await channel.send(embed)
}
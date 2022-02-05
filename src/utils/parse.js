/////////////////////// IMPORTS //////////////////////////
import { MessageEmbed } from "discord.js";

/////////////////////// SOURCE CODE ///////////////////////////
export async function parseOne(channel) {
    let embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("```fix\n" + `${process.env.ID}` + "\n```");

    await channel.send(embed);
}
export async function parseError(channel) {
    let embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("```fix\n" + `${process.env.PARSE_ERROR}` + "\n```");

    await channel.send(embed);
}
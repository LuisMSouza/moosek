/////////////////// IMPORTS ////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js');
const { usage, aliases, execute } = require('./play.js');
const Genius = new (require("genius-lyrics")).Client(process.env.GENIUS_API_KEY);

////////////////// SOURCE CODE /////////////////////
module.exports = {
    name: "letra",
    description: "Para pegar a letra de uma música",
    usage: [process.env.PREFIX_KEY + 'letra [nome da música]'],
    category: 'user',
    timeout: 7000,
    aliases: ['lyrics', 'l'],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);
        let main_entry = args.join(" ");
        let embed = new MessageEmbed()
        let msge = await message.channel.send("`Aguarde...`")

        if (!main_entry) {
            if (serverQueue) {
                main_entry = serverQueue.songs[0].title;
                try {
                    const songs = await Genius.songs.search(main_entry);
                    const lyrics = await songs[0].lyrics();

                    embed.setDescription(lyrics)
                    embed.setTitle(songs[0].fullTitle)
                    embed.setThumbnail(songs[0].thumbnail)
                    if (embed.description.length >= 2048) {
                        embed.description = `${embed.description.substr(0, 2045)}...`;
                    }
                    await msge.delete(msge)
                    message.channel.send(embed)
                    return;
                } catch (e) {
                    await msge.delete(msge)
                    sendError(`Ocorreu um erro :(\n**${e}**`, message.channel)
                    console.log(e);
                }
            } else {
                return sendError("não há nenhuma música sendo reproduzida, pesquise pelo nome da música que deseja ;)", message.channel);
            }
        } else {
            try {
                const songs = await Genius.songs.search(main_entry);
                const lyrics = await songs[0].lyrics();

                embed.setDescription(lyrics)
                embed.setTitle(songs[0].title)
                embed.setThumbnail(songs[0].thumbnail)
                if (embed.description.length >= 2048) {
                    embed.description = `${embed.description.substr(0, 2045)}...`;
                }
                await msge.delete(msge);
                message.channel.send(embed)
                return;
            } catch (e) {
                await msge.delete(msge)
                sendError(`Ocorreu um erro :(\n**${e}**`, message.channel)
                console.log(e);
            }
        }
    }
}

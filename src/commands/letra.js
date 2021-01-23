/////////////////// IMPORTS ////////////////////////
const { MessageEmbed } = require('discord.js');
const sendError = require('../utils/error.js');
const { usage, aliases, execute } = require('./play.js');
const lyrics_search = require('@penfoldium/lyrics-search');

////////////////// SOURCE CODE /////////////////////
module.exports = {
    name: "letra",
    description: "Para pegar a letra de uma música",
    usage: [process.env.PREFIX_KEY + 'letra [nome da música]'],
    aliases: ['lyrics', 'l'],

    async execute(client, message, args) {
        const serverQueue = client.queue.get(message.guild.id);
        const Lyrics = new lyrics_search(process.env.GENIUS_API_KEY);

        let main_entry = args.join(" ");
        if (!main_entry) {
            if (serverQueue) {
                main_entry = serverQueue.songs[0].title;
            } else {
                return sendError("não há nenhuma música sendo reproduzida, pesquise pelo nome da música que deseja ;)", message.channel);
            }
        }

        let mensagem = await message.channel.send('`Aguarde...`');

        let embed = new MessageEmbed()

        let letra = await Lyrics.search(main_entry)
            .then(result => {
                let mlyric;
                mlyric = result.lyrics;
                embed.setDescription(mlyric ? mlyric : result.url)
                if (embed.description.length >= 2048) {
                    embed.description = `${embed.description.substr(0, 2045)}...`;
                }

                embed.setTitle(result.title)
                embed.setThumbnail(result.header)
            })
            .catch(error => message.channel.send(error))

        mensagem.delete(mensagem);
        message.channel.send(embed);

        return;
    }
}

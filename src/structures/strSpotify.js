/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const sendError = require('../utils/error.js');
const music_init = require('./strMusic.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async spotifyHandler(message, music, channel) {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);

            const song = {
                id: music.id,
                title: music.title ? music.title : await ytdl.getBasicInfo(music.shortUrl).videoDetails.media.song,
                url: music.shortUrl,
                thumbnail: music.thumbnails[0].url,
                duration: music.duration,
                isLive: music.isLive,
                author: message.author.tag
            }

            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    prevSongs: [],
                    volume: 5,
                    bass: 1,
                    nigthCore: false,
                    playing: true,
                    looping: false,
                    songLooping: false
                }
                message.client.queue.set(message.guild.id, queueConstruct);
                queueConstruct.songs.push(song);

                try {
                    var connection = await channel.join();
                    queueConstruct.connection = connection;
                    music_init.play(message, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`Eu não consegui entrar no canal: ${error}`);
                    message.client.queue.delete(message.guild.id);
                    return sendError(`Eu não consegui entrar no canal: ${error}`, message.channel);

                }
            } else {
                serverQueue.songs.push(song);
                if (playlist) return;
                let thing = new MessageEmbed()
                    .setTitle(`> __Música adicionada à fila__`)
                    .setColor("GREEN")
                    .setThumbnail(song.img)
                    .setDescription(`[${song.title}](${song.url}) adicionado à fila`)
                    .addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
                    .addField("> __Pedido por:__", "```fix\n" + `${message.author.tag}` + "\n```", true)
                return serverQueue.textChannel.send(thing);
            }
            return;
        } catch (e) {
            return console.log(e);
        }
    }
}

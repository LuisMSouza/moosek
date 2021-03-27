/////////////////////// IMPORTS //////////////////////////
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const sendError = require('../utils/error.js')
const music_init = require('./music_init.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
    async handleVideo(video, message, channel, playlist = false) {
        try {
            const serverQueue = message.client.queue.get(message.guild.id);

            const song = {
                id: video.id,
                title: video.title ? video.title : await ytdl.getBasicInfo(video.shortUrl).videoDetails.media.song,
                url: video.shortUrl,
                thumbnail: video.thumbnails[0].url,
                duration: video.duration,
                isLive: video.isLive,
            }

            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: channel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true,
                    loop: false
                };
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
                    .setTitle(`Música adicionada à fila`)
                    .setThumbnail(song.img)
                    .setDescription(`**__${song.title}__** adicionado à fila`)
                return serverQueue.textChannel.send(thing);
            }
            return;
        } catch (e) {
            return console.log(e);
        }
    }
}
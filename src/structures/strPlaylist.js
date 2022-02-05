/////////////////////// IMPORTS //////////////////////////
import { MessageEmbed } from 'discord.js';
import { getBasicInfo } from 'ytdl-core';
import sendError from '../utils/error.js';
import { play } from './createPlayer.js';
import { joinVoiceChannel } from "@discordjs/voice";

/////////////////////// SOURCE CODE ///////////////////////////
export async function handleVideo(client, video, message, channel, playlist = false) {
    try {
        const serverQueue = message.client.queue.get(message.guild.id);

        const song = {
            id: video.id,
            title: video.title ? video.title : await getBasicInfo(video.shortUrl).videoDetails.media.song,
            url: video.shortUrl,
            thumbnail: video.thumbnails[0].url,
            duration: video.duration,
            isLive: video.isLive,
            author: message.member.user.tag,
            embed: {
                author: "Tocando agora:",
                color: "YELLOW",
                title: `${video.title}`,
                thumbnail: {
                    "url": `${video.thumbnails[0].url}`,
                },
                fields: [
                    {
                        "name": "> __Duração:__",
                        "value": "```fix\n" + `${video.duration}` + "\n```",
                        "inline": true
                    },
                    {
                        "name": "> __Canal:__",
                        "value": "```fix\n" + `${channel.name}` + "\n```",
                        "inline": true
                    },
                    {
                        "name": "> __Pedido por:___",
                        "value": "```fix\n" + `${message.member.user.tag}` + "\n```",
                        "inline": true
                    },
                ]
            }
        };

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: channel,
                connection: null,
                audioPlayer: null,
                resource: null,
                songs: [],
                prevSongs: [],
                volume: 100,
                nigthCore: false,
                playing: true,
                looping: false,
                songLooping: false
            };

            message.client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            try {
                const connection = joinVoiceChannel({
                    guildId: message.guild.id,
                    channelId: channel.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
                queueConstruct.connection = connection;
                play(client, message, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`Eu não consegui entrar no canal: ${error}`);
                message.client.queue.delete(message.guild.id);
                return sendError(`Eu não consegui entrar no canal: ${error}`, message.channel);

            }
        } else {
            serverQueue.songs.push(song);
            if (playlist)
                return;
            let thing = new MessageEmbed()
                .setTitle(`> __Música adicionada à fila__`)
                .setColor("YELLOW")
                .setThumbnail(song.img)
                .setDescription(`[${song.title}](${song.url}) adicionado à fila`)
                .addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
                .addField("> __Pedido por:__", "```fix\n" + `${message.author.tag}` + "\n```", true);
            return serverQueue.textChannel.send({ embeds: [thing] });
        }
        return;
    } catch (e) {
        return console.log(e);
    }
}
/////////////////////// IMPORTS //////////////////////////
import { MessageEmbed } from 'discord.js';
import sendError from '../utils/error.js';
import { play } from './createPlayer.js';
import { search } from 'play-dl';
import { joinVoiceChannel } from "@discordjs/voice";

/////////////////////// SOURCE CODE ///////////////////////////
export async function handleVideo(client, track, message, channel, playlist = false) {
    const serverQueue = message.client.queue.get(message.guild.id);
    try {
        await search(`${track.name} - ${track.artists[0].name} Official Audio`, { limit: 1 }).then(async (x) => {
            const song = {
                title: x[0].title,
                url: x[0].url,
                thumbnail: x[0].thumbnails[0].url,
                duration: x[0].durationRaw,
                liveStream: x[0].live,
                author: message.member.user.tag,
                embed: {
                    author: "Tocando agora:",
                    color: "YELLOW",
                    title: `${x[0].title}`,
                    thumbnail: {
                        "url": `${x[0].thumbnails[0].url}`,
                    },
                    fields: [
                        {
                            "name": "> __Duração:__",
                            "value": "```fix\n" + `${x[0].live ? "🔴 Live" : x[0].durationRaw}` + "\n```",
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
        });
    } catch (e) {
        return console.log(e);
    }
}
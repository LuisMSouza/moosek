const { createAudioPlayer, createAudioResource, entersState, StreamType, VoiceConnectionStatus } = require("@discordjs/voice");
const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const ytdl = require('ytdl-core');
const sendError = require('../utils/error.js');
const leaveChannel = require('../utils/leaveChannel.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports.play = async (client, message, song) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!song) {
        return leaveChannel(client, message, song);
    }
    try {
        var stream = await ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly", quality: "highestaudio" });

    } catch (error) {
        if (serverQueue) {
            if (serverQueue.loop) {
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                module.exports.play(client, message, serverQueue.songs[0]);
            } else {
                serverQueue.songs.shift();
                module.exports.play(client, message, serverQueue.songs[0]);
            }
        }
    }

    serverQueue.audioPlayer = createAudioPlayer();
    serverQueue.resource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.Arbitrary });
    serverQueue.audioPlayer.play(serverQueue.resource);

    try {
        await entersState(serverQueue.connection, VoiceConnectionStatus.Ready, 30_000);
        serverQueue.connection.subscribe(serverQueue.audioPlayer);
    } catch (error) {
        serverQueue.connection.destroy();
        throw error;
    }
    serverQueue.resource.playStream
        .on("end", () => {
            if (playingMessage && playingMessage.deleted)
                playingMessage.delete().catch(console.error);

            if (serverQueue.loop) {
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                module.exports.play(client, message, serverQueue.songs[0]);
            } else {
                serverQueue.songs.shift();
                module.exports.play(client, message, serverQueue.songs[0]);
            }
        })
        .on("error", (error) => {
            console.log(error);
            if (playingMessage && !playingMessage.deleted)
                playingMessage.delete().catch(console.error);

            if (serverQueue.loop) {
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                module.exports.play(client, message, serverQueue.songs[0]);
            } else {
                serverQueue.songs.shift();
                module.exports.play(client, message, serverQueue.songs[0]);
            }
        })
    serverQueue.audioPlayer
        .on("error", (error) => {
            console.log(error);
            if (playingMessage && playingMessage.deleted)
                playingMessage.delete().catch(console.error);

            if (serverQueue.loop) {
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                module.exports.play(client, message, serverQueue.songs[0]);
            } else {
                serverQueue.songs.shift();
                module.exports.play(client, message, serverQueue.songs[0]);
            }
        });
    try {
        var embedMusic = new MessageEmbed()
            .setAuthor("Tocando agora:")
            .setColor("#0f42dc")
            .setTitle(song.title)
            .setThumbnail(song.thumbnail)
            .setURL(song.url)

        if (song.duration === '0:00' || song.liveStream) {
            songEmbed.addField("> __Duração:__", "🔴 Live", true)
            sendError("**Este video é uma live, talvez não seja possível reproduzir...**", serverQueue.textChannel)
        } else {
            songEmbed.addField("> __Duração:__", "```fix\n" + `${song.duration}` + "\n```", true)
        }

        songEmbed.addField("> __Canal:__", "```fix\n" + `${message.member.voice.channel.name ? message.member.voice.channel.name : "Not provided"}` + "\n```", true)
        songEmbed.addField("> __Pedido por:___", "```fix\n" + `${song.author}` + "\n```", true)

        var playingMessage = await serverQueue.textChannel.send({ embeds: [embedMusic] });
    } catch (error) {
        console.log(error)
    }
}
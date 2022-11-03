const {
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Colors, ButtonStyle } = require("discord.js");
const ytdl2 = require("play-dl");
const sendError = require("../utils/error.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports.play = async (client, message, song) => {
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!song) {
    await message.client.queue.delete(message.guild.id);
    if (serverQueue) {
      return serverQueue.connection.disconnect();
    }
  }
  try {
    ytdl2.authorization();
    var stream = await ytdl2.stream(song.url);
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

  try {
    serverQueue.audioPlayer = createAudioPlayer();
    serverQueue.resource = createAudioResource(stream.stream, {
      inlineVolume: true,
      inputType: stream.type,
    });
    serverQueue.audioPlayer.play(serverQueue.resource);
    await entersState(
      serverQueue.connection,
      VoiceConnectionStatus.Ready,
      30_000
    );
    serverQueue.connection.subscribe(serverQueue.audioPlayer);
  } catch (error) {
    if (serverQueue) {
      if (
        error.message.includes(
          "Cannot read properties of undefined (reading 'stream')"
        )
      ) {
        sendError(
          "Ocorreu um erro ao tentar reproduzir esta música...",
          serverQueue.textChannel
        );
        await serverQueue.songs.shift();
        return module.exports.play(client, message, serverQueue.songs[0]);
      }
      return sendError(
        "Ocorreu um erro na reprodução, tente novamente...",
        serverQueue.textChannel
      );
    }
    console.log(error);
    return sendError(
      "Alguma coisa desastrosa aconteceu, tente novamente...",
      message.channel
    );
  }
  try {
    var embedMusic = new EmbedBuilder()
      .setAuthor({ name: "Tocando agora:" })
      .setColor(Colors.Yellow)
      .setTitle(serverQueue.songs[0].title)
      .setThumbnail(serverQueue.songs[0].thumbnail);

    if (
      serverQueue.songs[0].duration === "0:00" ||
      serverQueue.songs[0].liveStream
    ) {
      embedMusic.addFields([
        { name: "> __**Duração:**__", value: "```fix\n🔴 Live\n```", inline: true }
      ])
    } else {
      embedMusic.addFields([
        { name: "> __**Duração:**__", value: "```fix\n" + `${serverQueue.songs[0].duration}` + "\n```", inline: true }
      ])
    }
    embedMusic.addFields([
      { name: "> __**Canal:**__", value: "```fix\n" + `${message.guild.members.me.voice.channel.name ? message.guild.members.me.voice.channel.name : "Not provided"}` + "\n```", inline: true },
      { name: "> __**Pedido por:**__", value: "```fix\n" + `${serverQueue.songs[0].author}` + "\n```", inline: true },
    ])

    const button = new ButtonBuilder()
      .setCustomId("pause")
      .setEmoji("<:4210635:914638880492372009>")
      .setStyle(ButtonStyle.Secondary);
    const button2 = new ButtonBuilder()
      .setCustomId("pause_2")
      .setEmoji("<:4210635:914638880492372009>")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);
    const button3 = new ButtonBuilder()
      .setCustomId("play")
      .setEmoji("<:4210629:914638880798568548>")
      .setStyle(ButtonStyle.Secondary);
    const button4 = new ButtonBuilder()
      .setCustomId("play_2")
      .setEmoji("<:4210629:914638880798568548>")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);
    const button5 = new ButtonBuilder()
      .setCustomId("backward")
      .setEmoji("<:4210650:914638881184440350>")
      .setStyle(ButtonStyle.Secondary);
    const button6 = new ButtonBuilder()
      .setCustomId("forward")
      .setEmoji("<:4210646:914638880857272421>")
      .setStyle(ButtonStyle.Secondary);
    const button7 = new ButtonBuilder()
      .setCustomId("stop")
      .setEmoji("<:4210632:914638880827916339>")
      .setStyle(ButtonStyle.Secondary);

    const row3 = new ActionRowBuilder().addComponents(
      button,
      button4,
      button5,
      button6,
      button7
    );

    var playingMessage = await serverQueue.textChannel.send({
      embeds: [song.embed],
      components: [row3],
    });
    serverQueue.songs[0].messageId = playingMessage.id
    serverQueue.audioPlayer.on("stateChange", async (oldState, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle
      ) {
        await playingMessage.edit({ embeds: [song.embed], components: [] });
        if (serverQueue.looping) {
          let lastSong = serverQueue.songs.shift();
          serverQueue.songs.push(lastSong);
          return module.exports.play(client, message, serverQueue.songs[0]);
        }
        if (serverQueue.nigthCore) {
          if (!serverQueue.songLooping) {
            var random = Math.floor(Math.random() * serverQueue.songs.length);
            await this.play(client, message, serverQueue.songs[random]);
            await serverQueue.songs.splice(random, 1);
            return;
          }
        }
        if (!serverQueue.songLooping) await serverQueue.songs.shift();
        return module.exports.play(client, message, serverQueue.songs[0]);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

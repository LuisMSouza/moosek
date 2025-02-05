/////////////////// IMPORTS ////////////////////////
const { EmbedBuilder, ApplicationCommandOptionType, Colors } = require("discord.js");
const sendError = require("../utils/error.js");
const ytdl = require("ytdl-core");
const dl = require("play-dl");
const lyricsFinder = require('simple-find-lyrics');

////////////////// SOURCE CODE /////////////////////
module.exports = {
  name: "lyrics",
  description: "Para pegar a letra de uma música",
  options: [
    {
      name: "song",
      type: ApplicationCommandOptionType.String, // 'STRING' Type
      description: "Música para ser pesquisada a letra",
      required: false,
    },
  ],
  usage: [process.env.PREFIX_KEY + "lyrics [nome da música]"],
  category: "user",
  timeout: 7000,
  aliases: ["letra", "l"],

  async execute(client, message, args) {
    var query;
    try {
      if (args) {
        query = args.get("song")
          ? args.get("song").value
          : null || args.join(" ");
      }
    } catch (e) {
      if (
        e.message.includes("Cannot read properties of null (reading 'value')")
      ) {
        query = null;
      }
    }
    const emoji = client.guilds.cache
      .get("731542666277290016")
      .emojis.cache.find((emj) => emj.name === "7041_loading");
    const serverQueue = client.queue.get(message.guild.id);
    const SearchStr = query;
    let msge = await message.channel.send(`${emoji}`);

    if (!SearchStr) {
      if (serverQueue) {
        try {
          message.reply("🔎 Aguardando busca...");
          const search = await ytdl.getBasicInfo(serverQueue.songs[0].url);
          const r = await lyricsFinder(`${serverQueue.songs[0].title}`)
          await generateEmbeds(
            message,
            r.lyrics,
            search.videoDetails.media.song ? search.videoDetails.media.song : search.videoDetails.title,
            search.videoDetails.thumbnails[0].url,
            search.videoDetails.media.artist
          );
          return msge.delete(msge);
        } catch (e) {
          msge.delete(msge);
          sendError(
            `Não encontrei resultados. Tente procurar digitando o nome da música...`,
            message.channel
          );
          return console.log(e);
        }
      } else {
        await msge.delete(msge);
        return sendError(
          "Não há nenhuma música sendo reproduzida, pesquise pelo nome da música que deseja ;)",
          message.channel
        );
      }
    } else {
      try {
        message.reply("🔎 Aguardando busca...");
        dl.authorization();
        const input = await dl.search(`${SearchStr}`);
        const search = await ytdl.getBasicInfo(input[0].url);
        const r = await lyricsFinder(`${SearchStr}`)
        await generateEmbeds(
          message,
          r.lyrics,
          search.videoDetails.media.song ? search.videoDetails.media.song : search.videoDetails.title,
          search.videoDetails.thumbnails[0].url,
          search.videoDetails.media.artist
        );
        return msge.delete(msge);
      } catch (e) {
        msge.delete(msge);
        sendError(`Não encontrei resultados...`, message.channel);
        return console.log(e);
      }
    }
    async function generateEmbeds(message, lyrics, title, thumb, artist) {
      if (lyrics.length < 1) return sendError(`Não encontrei resultados...`, message.channel);
      let embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setThumbnail(`${thumb}`)
        .setColor(Colors.Yellow);
      let embed2 = new EmbedBuilder().setColor(Colors.Yellow);
      let embed3 = new EmbedBuilder().setColor(Colors.Yellow);
      let embed4 = new EmbedBuilder().setColor(Colors.Yellow);

      embed.setDescription(`${lyrics}`);
      embed2.setDescription(`${lyrics}`);
      embed3.setDescription(`${lyrics}`);
      embed4.setDescription(`${lyrics}`);
      embed.setDescription(`${lyrics}`);

      if (embed.data.description.length > 2048 && embed.data.description.length <= 4090) {
        embed.description = `${embed.description.substr(0, 2045)}...`;
        await message.channel.send({ embeds: [embed] });
        embed2.description = `${lyrics.substr(2045)}`;
        if (embed2.description != "..." || embed2.description != "") {
          await message.channel.send({ embeds: [embed2] });
        }
      } else if (embed.data.description.length > 4090) {
        embed.description = `${embed.description.substr(0, 2045)}...`;
        await message.channel.send({ embeds: [embed] });
        embed2.description = `${lyrics.substr(2045, 2045)}...`;
        await message.channel.send({ embeds: [embed2] });
        embed3.description = `${lyrics.substr(4090, 2045)}...`;
        if (embed3.description !== "...") {
          await message.channel.send({ embeds: [embed3] });
        }
        embed4.description = `${lyrics.substr(6135, 2045)}...`;
        if (embed4.description !== "...") {
          await message.channel.send({ embeds: [embed4] });
        }
      } else {
        await message.channel.send({ embeds: [embed] });
      }
    }
  },
};

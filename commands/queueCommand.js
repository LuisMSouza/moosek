/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = {
  name: "queue",
  description: "Para ver a fila de músicas do servidor",
  usage: [process.env.PREFIX_KEY + "queue"],
  category: "user",
  timeout: 7000,
  aliases: ["fila", "q", "f", "lista"],

  async execute(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);

    if (!serverQueue)
      return sendError(
        "Não há nenhuma música sendo reproduzida.",
        message.channel
      );

    let currentPage = 0;
    const embeds = generateQueueEmbed(message, serverQueue.songs);

    let bt1 = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("queue_next")
      .setEmoji("<:6269110:914638881016664096>");
    let bt1b = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("queue_next")
      .setEmoji("<:6269110:914638881016664096>");
    let bt2 = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("queue_prev")
      .setEmoji("<:6269618:914638881155055657>");
    let bt2b = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId("queue_prev")
      .setEmoji("<:6269618:914638881155055657>");
    let bt3 = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setDisabled()
      .setCustomId("queue_num")
      .setLabel(`${currentPage + 1}/${embeds.length}`);

    if (embeds.length <= 1) {
      bt1.setDisabled();
      bt2.setDisabled();
    }
    bt2.setDisabled();

    var buttonRow = new ActionRowBuilder().addComponents([bt2, bt3, bt1]);

    const queueEmbed = await message.reply({
      components: [buttonRow],
      embeds: [embeds[currentPage]],
    });

    const filter = (button) => button.user.id != client.user.id;
    const collector = serverQueue.textChannel.createMessageComponentCollector({
      filter,
      time: 300000,
    });

    collector.on("collect", async (b) => {
      try {
        if (b.customId === "queue_next") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            await bt3.setLabel(`${currentPage + 1}/${embeds.length}`);
            var buttonRow2 = new ActionRowBuilder();
            if (currentPage + 1 === embeds.length) {
              bt1.setDisabled();
              buttonRow2.addComponents([bt2b, bt3, bt1]);
            } else if (currentPage + 1 === 1) {
              bt2.setDisabled();
              buttonRow2.addComponents([bt2, bt3, bt1b]);
            } else {
              buttonRow2.addComponents([bt2b, bt3, bt1b]);
            }
            await b.update({
              components: [buttonRow2],
              embeds: [embeds[currentPage]],
            });
          }
        } else if (b.customId === "queue_prev") {
          if (currentPage !== 0) {
            --currentPage;
            await bt3.setLabel(`${currentPage + 1}/${embeds.length}`);
            var buttonRow3 = new ActionRowBuilder();
            if (currentPage + 1 === embeds.length) {
              bt1.setDisabled();
              buttonRow3.addComponents([bt2, bt3, bt1]);
            } else if (currentPage + 1 === 1) {
              bt2.setDisabled();
              buttonRow3.addComponents([bt2, bt3, bt1b]);
            } else {
              buttonRow3.addComponents([bt2b, bt3, bt1b]);
            }
            await b.update({
              components: [buttonRow3],
              embeds: [embeds[currentPage]],
            });
          }
        }
      } catch (err) {
        if (err.message.includes("DiscordAPIError: Unknown interaction"))
          return;
        console.log(err);
      }
      return;
    });

    function generateQueueEmbed(message, queue) {
      const serverQueue = message.client.queue.get(message.guild.id);
      let embeds = [];
      let k = 10;

      for (let i = 0; i < serverQueue.songs.length; i += 10) {
        const current = serverQueue.songs.slice(i, k);
        let j = i;
        k += 10;

        const info = current
          .map((track) => `**\`${++j}\`** | [\`${track.title}\`](${track.url})`)
          .join("\n");

        const embed = new EmbedBuilder()
          .setTitle(`Fila de músicas do servidor`)
          .setColor(Colors.Yellow)
          .setThumbnail(message.guild.iconURL())
          .setDescription(`${info}`)
          .addFields([
            { name: '> __**Tocando agora**__', value: `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`, inline: true },
            { name: '> __**Canal de texto**__', value: `${serverQueue.textChannel}`, inline: true },
            { name: '> __**Canal de voz**__', value: `${serverQueue.voiceChannel}`, inline: true }
          ])
        if (serverQueue.songs.length === 1)
          embed.setDescription(
            `Sem músicas na fila. Adicione mais digitando: .play <nome da música>`
          );

        embeds.push(embed);
      }

      return embeds;
    }
  },
};

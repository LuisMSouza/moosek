/////////////////////// IMPORTS //////////////////////////
import sendError from "../utils/error.js";
import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "queue";
export const description = "Para ver a fila de músicas do servidor";
export const usage = [process.env.PREFIX_KEY + "queue"];
export const category = "user";
export const timeout = 7000;
export const aliases = ["fila", "q", "f", "lista"];
export async function execute(client, message, args) {
  const eNext = client.guilds.cache
    .get("731542666277290016")
    .emojis.cache.find((emj) => emj.name === "6269110");
  const eBack = client.guilds.cache
    .get("731542666277290016")
    .emojis.cache.find((emj) => emj.name === "6269618");
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue)
    return sendError(
      "Não há nenhuma música sendo reproduzida.",
      message.channel
    );

  let currentPage = 0;
  const embeds = generateQueueEmbed(message, serverQueue.songs);

  let bt1 = new MessageButton()
    .setStyle("SUCCESS")
    .setCustomId("queue_next")
    .setEmoji(eNext);
  let bt1b = new MessageButton()
    .setStyle("SUCCESS")
    .setCustomId("queue_next")
    .setEmoji(eNext);
  let bt2 = new MessageButton()
    .setStyle("SUCCESS")
    .setCustomId("queue_prev")
    .setEmoji(eBack);
  let bt2b = new MessageButton()
    .setStyle("SUCCESS")
    .setCustomId("queue_prev")
    .setEmoji(eBack);
  let bt3 = new MessageButton()
    .setStyle("SECONDARY")
    .setDisabled()
    .setCustomId("queue_num")
    .setLabel(`${currentPage + 1}/${embeds.length}`);

  if (embeds.length <= 1) {
    bt1.setDisabled();
    bt2.setDisabled();
  }
  bt2.setDisabled();

  var buttonRow = new MessageActionRow().addComponents([bt2, bt3, bt1]);

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
          var buttonRow2 = new MessageActionRow();
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
          var buttonRow3 = new MessageActionRow();
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
      if (err.message.includes("DiscordAPIError: Unknown interaction")) return;
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

      const embed = new MessageEmbed()
        .setTitle(`Fila de músicas do servidor`)
        .setColor("YELLOW")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`${info}`)
        .addField(
          "Tocando agora",
          `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`,
          true
        )
        .addField("Canal de texto", `${serverQueue.textChannel}`, true)
        .addField("Canal de voz", `${serverQueue.voiceChannel}`, true);
      //.setFooter(`${message.guild.name}`, `${message.guild.iconURL()}`)
      if (serverQueue.songs.length === 1)
        embed.setDescription(
          `Sem músicas na fila. Adicione mais digitando: .play <nome da música>`
        );

      embeds.push(embed);
    }

    return embeds;
  }
}

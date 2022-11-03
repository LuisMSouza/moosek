/////////////////////// IMPORTS //////////////////////////
const sendError = require("../utils/error.js");
const Discord = require("discord.js");
const radioStations = require("../utils/radioStations.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, Colors, ButtonStyle } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
} = require("@discordjs/voice");

/////////////////////// SOURCE CODE //////////////////////////
module.exports = {
  name: "radio",
  description: "Inicia o streaming de radio",
  usage: [process.env.PREFIX_KEY + "radio [numero da radio na lista]"],
  category: "user",
  timeout: 7000,
  aliases: ["r"],

  async execute(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (serverQueue) {
      if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
        message.reply({
          embeds: [
            {
              color: Colors.Red,
              description: "```\n❌ - O bot está sendo utilizado em outro canal!\n```",
            },
          ],
          ephemeral: true
        });
        return;
      }
      message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - Você deve parar a fila de músicas primeiro!\n```",
          },
        ],
        ephemeral: true
      });
      return;
    }
    const choice = args[0];
    const radioListen = client.radio.get(message.guild.id);
    if (radioListen)
      return message.reply({
        embeds: [
          {
            color: Colors.Red,
            description: "```\n❌ - A rádio já está sendo executada!\n```",
          },
        ],
        ephemeral: true
      });
    if (!choice) {
      let row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("radio_select")
          .setPlaceholder("Selecione a Rádio")
          .addOptions([
            {
              label: "Standard-Radio",
              description: "🇩🇪",
              value: "1",
            },
            {
              label: "Chill-Radio",
              description: "🇩🇪",
              value: "2",
            },
            {
              label: "Greatest-hits-Radio",
              description: "🇩🇪",
              value: "3",
            },
            {
              label: "Hip-hop-Radio",
              description: "🇩🇪",
              value: "4",
            },
            {
              label: "Rádio Itatiaia",
              description: "🇧🇷",
              value: "5",
            },
            {
              label: "Rádio FM 98",
              description: "🇧🇷",
              value: "6",
            },
            {
              label: "Rádio Jovem Pan 107.3 FM",
              description: "🇧🇷",
              value: "7",
            },
            {
              label: "Rádio Alvorada FM",
              description: "🇧🇷",
              value: "8",
            },
            {
              label: "89 FM A Rádio Rock",
              description: "🇧🇷",
              value: "9",
            },
            {
              label: "Liberdade FM",
              description: "🇧🇷",
              value: "10",
            },
            {
              label: "American Road Radio",
              description: "🇺🇸",
              value: "11",
            },
            {
              label: "Classic Rock Florida",
              description: "🇺🇸",
              value: "12",
            },
            {
              label: "Rádio Z100 - 100.3 FM",
              description: "🇺🇸",
              value: "13",
            },
            {
              label: "89.7 KSGN",
              description: "🇺🇸",
              value: "14",
            },
            {
              label: "WNCI 97.9",
              description: "🇺🇸",
              value: "15",
            },
            {
              label: "Radio Music Italia",
              description: "🇮🇹",
              value: "16",
            },
          ])
      );
      await message.reply({
        content: "**Faça a escolha da rádio no menu abaixo:**",
        ephemeral: true,
      });
      const msgEmb = await message.channel.send({
        components: [row],
        embeds: [
          {
            description: "> **Faça a escolha da rádio:**",
            color: Colors.Yellow,
          },
        ],
      });
      const filter = (i) =>
        i.user.id === (message.member.user.id || message.user.id);
      const collector = message.channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 300_000,
      });
      collector.on("collect", async (m) => {
        m.reply({
          content: "```\n" + `Você selecionou: ${radioStations.radioStationsName[m.values[0] - 1]
            }` + "\n```",
          ephemeral: true,
        });
        switch (m.values[0]) {
          case "1":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[0],
              radioStations.radioStationsName[0]
            );
            break;
          case "2":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[1],
              radioStations.radioStationsName[1]
            );
            break;
          case "3":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[2],
              radioStations.radioStationsName[2]
            );
            break;
          case "4":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[3],
              radioStations.radioStationsName[3]
            );
            break;
          case "5":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[4],
              radioStations.radioStationsName[4]
            );
            break;
          case "6":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[5],
              radioStations.radioStationsName[5]
            );
            break;
          case "7":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[6],
              radioStations.radioStationsName[6]
            );
            break;
          case "8":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[7],
              radioStations.radioStationsName[7]
            );
            break;
          case "9":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[8],
              radioStations.radioStationsName[8]
            );
            break;
          case "10":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[9],
              radioStations.radioStationsName[9]
            );
            break;
          case "11":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[10],
              radioStations.radioStationsName[10]
            );
            break;
          case "12":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[11],
              radioStations.radioStationsName[11]
            );
            break;
          case "13":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[12],
              radioStations.radioStationsName[12]
            );
            break;
          case "14":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[13],
              radioStations.radioStationsName[13]
            );
            break;
          case "15":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[14],
              radioStations.radioStationsName[14]
            );
            break;
          case "16":
            await msgEmb.delete(msgEmb);
            await initRadio(
              message,
              client,
              args,
              radioStations.radioStations[15],
              radioStations.radioStationsName[15]
            );
            break;
        }
      });
    }
    async function initRadio(msg, bot, args, choice, choiceName) {
      try {
        var connection = await joinVoiceChannel({
          channelId: message.member.voice.channel.id,
          guildId: message.guild.id,
          adapterCreator: message.channel.guild.voiceAdapterCreator,
        });
        const radioListenConstruct = {
          playing: true,
          channel: msg.member.voice.channel,
          author: msg.member.user.tag,
          audioPlayer: null,
          resource: null,
          connection: connection,
          textChannel: msg.channel,
          voiceChannel: msg.member.voice.channel,
          messageId: msg.id
        };
        bot.radio.set(msg.guild.id, radioListenConstruct);
        const radioStruct = msg.client.radio.get(msg.guild.id);
        radioStruct.connection = connection;
        radioStruct.audioPlayer = createAudioPlayer();
        radioStruct.connection.subscribe(radioStruct.audioPlayer);
        radioStruct.resource = createAudioResource(choice);
        radioStruct.audioPlayer.play(radioStruct.resource);

        const embedRadio = new EmbedBuilder()
          .setAuthor({ name: "Tocando agora:" })
          .setColor(Colors.Yellow)
          .setTitle(choiceName)
          .addFields([
            { name: '> __**Canal:**__', value: "```fix\n" + `${msg.member.voice.channel.name}` + "\n```", inline: true },
            { name: '> __**Pedido por:**__', value: "```fix\n" + `${radioListenConstruct.author}` + "\n```", inline: true },
          ])
        switch (choiceName) {
          case "Rádio Itatiaia":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869344337625118/itatiaia.png"
            );
            break;
          case "Rádio FM 98":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869345436536862/98.png"
            );
            break;
          case "Rádio Jovem Pan 107.3 FM":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869346581610518/jovem_pan.png"
            );
            break;
          case "Rádio Alvorada FM":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869348007673917/alvorada.png"
            );
            break;
          case "89 FM A Rádio Rock":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869349848948756/89_fm.png"
            );
            break;
          case "Liberdade FM":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869343763038268/liberdade.png"
            );
            break;
          case "American Road Radio":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869352160018452/american_road.jpg"
            );
            break;
          case "Classic Rock Florida":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869355398008852/cr_florida.png"
            );
            break;
          case "Rádio Z100 - 100.3 FM":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869356744400926/z100.png"
            );
            break;
          case "89.7 KSGN":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899869358883487784/ksgn.png"
            );
            break;
          case "WNCI 97.9":
            embedRadio.setThumbnail(
              "https://cdn.discordapp.com/attachments/807747123676053504/899871493972967475/wnci.png"
            );
            break;
        }

        const button1 = new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId("stop_radio")
          .setLabel("PARAR RADIO");

        const buttonStop = new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId("pause_radio")
          .setLabel("PAUSAR RADIO");

        const row = new ActionRowBuilder().addComponents(button1, buttonStop);

        const buttonMsg = await message.channel.send({
          components: [row],
          embeds: [embedRadio],
        });
      } catch (e) {
        if (e.message === "Unknown stream type")
          return message.reply({
            embeds: [
              {
                color: Colors.Red,
                description:
                  "```\n❌ - Rádio não encontrada.\n```",
              },
            ],
            ephemeral: true,
          });
        return message.reply({
          embeds: [
            {
              color: Colors.Red,
              description:
                "```\n❌ - Ocorreu um erro ao executar a rádio.\n```",
            },
          ],
          ephemeral: true,
        }) && console.log(e)
      }
    }
  },
};

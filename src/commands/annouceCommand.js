/////////////////////// IMPORTS //////////////////////////
import { CEO_ID } from "../utils/botUtils.js";
import { find } from "../models/guildData.js";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

/////////////////////// SOURCE CODE //////////////////////////
export const name = "announce";
export const description =
  "Faz um anúncio a todos os servidores em que o bot está";
export const usage = [process.env.PREFIX_KEY + "announce"];
export const category = "ceo";
export const timeout = 7000;
export const aliases = ["anc", "msgall", "msg"];
export async function execute(client, message, args) {
  if (message.author.id != CEO_ID) return;

  const msg = args.join(" ") || args;
  if (!msg) return;

  const embed = new MessageEmbed()
    .setTitle("ANÚNCIO DOS DESENVOLVEDORES")
    .setDescription(`${msg}`)
    .setColor("YELLOW")
    .setFooter(
      "THE DRAGONS COMMUNITY TEAM • ALL RIGHTS RESERVED",
      "https://i.imgur.com/l59rO0X.gif"
    );

  const button = new MessageButton()
    .setStyle("LINK")
    .setLabel("TDG COMMUNITY")
    .setURL("https://discord.gg/5QvAqkS7fy");

  const row = new MessageActionRow().addComponents(button);

  const data = await find({});
  data.forEach(async function (c) {
    try {
      const guild = c.guildID;
      const channelSystem = client.guilds.cache.get(guild);
      const channelUpdates = client.guilds.cache.get(guild);

      const cSystem = channelSystem.systemChannel;
      const cUpdates = channelUpdates.publicUpdatesChannel;
      console.log(cSystem);
      if (!cSystem && !cUpdates) return;
      if (cUpdates) {
        cUpdates.send({ components: [row], embeds: [embed] }) &&
          console.log("[CLIENT] ANÚNCIO ENVIADO");
        return;
      } else {
        cSystem.send({ components: [row], embeds: [embed] }) &&
          console.log("[CLIENT] ANÚNCIO ENVIADO");
        return;
      }
    } catch (e) {
      console.log(e);
    }
  });
}

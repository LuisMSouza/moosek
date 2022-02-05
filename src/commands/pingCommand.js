/////////////////////// IMPORTS ///////////////////////////

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "ping";
export const description = "Mostra o ping da aplicação";
export const usage = [process.env.PREFIX_KEY + "ping"];
export const category = "user";
export const timeout = 5000;
export const aliases = [];
export async function execute(client, message, args) {
  let ping = Math.round(message.client.ws.ping);
  message.reply({
    embeds: [
      {
        color: "YELLOW",
        description: `**${ping} ms**`,
      },
    ],
  });
}

/////////////////////// IMPORTS //////////////////////////
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
import { CEO_ID } from "../utils/botUtils.js";

/////////////////////// SOURCE CODE //////////////////////////
export const name = "reboot";
export const description = "Reinicia o bot";
export const usage = [process.env.PREFIX_KEY + "reboot"];
export const category = "ceo";
export const timeout = 7000;
export const aliases = ["rb"];
export async function execute(client, message, args) {
  if (message.author.id != CEO_ID) return;
  await message.reply({
    embeds: [
      {
        color: "YELLOW",
        description: "```\nBot reiniciado!\n```",
      },
    ],
  });
  fetch(`https://discloud.app/status/bot/778462497728364554/restart`, {
    method: "POST",
    headers: {
      "api-token":
        "DQl90nQTPADiqzdwlEuDMQMPXWTWnaGmCKvoIDVNuWy8PC66ARtT0PoyUkCwVs",
    },
  })
    .then((info) => info.json())
    .then(async (json) => {});
}

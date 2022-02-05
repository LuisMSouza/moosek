/////////////////////// IMPORTS ///////////////////////////
import sendError from "../utils/error.js";
import Move from "array-move-item";

/////////////////////// SOURCE CODE ///////////////////////////
export const name = "move";
export const description = "Para mudar a posição de uma música na fila";
export const options = [
  {
    name: "old",
    type: 4,
    description: "Posição atual da música na fila",
    required: true,
  },
  {
    name: "new",
    type: 4,
    description: "Posição para qual vai ser colocado",
    required: true,
  },
];
export const usage = [
  process.env.PREFIX_KEY + "move [posição atual] [nova posição]",
];
export const category = "user";
export const timeout = 5000;
export const aliases = ["mv", "mover"];
export async function execute(client, message, args) {
  var query1;
  var query2;
  try {
    if (args) {
      query1 = args.get("old") ? args.get("old").value : null || args.join(" ");
      query2 = args.get("new") ? args.get("new").value : null || args.join(" ");
    }
  } catch (e) {
    if (
      e.message.includes("Cannot read properties of null (reading 'value')")
    ) {
      query1 = null;
      query2 = null;
    }
  }
  const serverQueue = client.queue.get(message.guild.id);
  var oldPosition = query1;
  var newPosition = query2;
  if (!serverQueue)
    return sendError(
      "Não há nenhuma música sendo reproduzida.",
      message.channel
    );
  if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
    serverQueue.textChannel.send({
      embeds: [
        {
          color: "RED",
          description: "❌ **O bot está sendo utilizado em outro canal!**",
        },
      ],
    });
    return;
  }

  if (!args.length && !query1 && !query2) return;
  if (!oldPosition)
    return sendError(
      "Você deve inserir a posição atual da música e em seguida a nova posição. Exemplo: " +
        `${process.env.PREFIX_KEY}move [posição atual] [nova posição]`,
      message.channel
    );
  if (!newPosition)
    return sendError(
      "Você deve inserir a posição atual da música e em seguida a nova posição. Exemplo: " +
        `${process.env.PREFIX_KEY}move [posição atual] [nova posição]`,
      message.channel
    );

  if (isNaN(oldPosition) || oldPosition <= 1 || oldPosition === newPosition)
    return sendError("Informe valores válidos!", message.channel);
  if (isNaN(newPosition) || newPosition <= 1 || newPosition === oldPosition)
    return sendError("Informe valores válidos!", message.channel);

  let song = serverQueue.songs[oldPosition - 1].title;

  try {
    const newQueue = await Move(
      serverQueue.songs,
      oldPosition - 1,
      newPosition == 1 ? 1 : newPosition - 1
    );
    serverQueue.songs = newQueue;
    message.reply({
      embeds: [
        {
          color: "YELLOW",
          description: `**${song}** agora está na posição **${newPosition}** da fila.`,
        },
      ],
    });
  } catch (e) {
    console.log(e);
  }
}

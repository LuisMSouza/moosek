//______________________________________________//
const { Colors } = require("discord.js");
const play = require("../structures/createPlayer.js");

//______________________________________________//
module.exports = {
    name: "backward",

    async execute(client, interaction) {
        const serverQueue = interaction.client.queue.get(interaction.guild.id);
        if (!serverQueue) {
            await interaction.update({
                embeds: [
                    {
                        color: Colors.Red,
                        description:
                            "```\n❌ - Fila de músicas finalizada.\n```",
                    },
                ],
                components: []
            });
            return;
        }
        if (!interaction.member.voice.channel) {
            interaction.reply({
                embeds: [
                    {
                        color: Colors.Red,
                        description:
                            "```\n❌ - Você precisa estar em um canal de voz para reagir!\n```",
                    },
                ],
                ephemeral: true,
            });
            return;
        }
        if (serverQueue.voiceChannel.id !== interaction.member.voice.channel.id) {
            interaction.reply({
                embeds: [
                    {
                        color: Colors.Red,
                        description:
                            "```\n❌ - O bot está sendo utilizado em outro canal.\n```",
                    },
                ],
                ephemeral: true,
            });
            return;
        }
        if (serverQueue) {
            try {
                if (
                    serverQueue.prevSongs[0] == undefined ||
                    serverQueue.prevSongs[0] === null ||
                    serverQueue.prevSongs[0] === []
                ) {
                    return interaction.reply({
                        embeds: [
                            {
                                color: Colors.Red,
                                description:
                                    "```\n❌ - Não há nenhuma música anterior.\n```",
                            },
                        ],
                        ephemeral: true,
                        components: []
                    });
                }
                await interaction.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                await serverQueue.songs.unshift(serverQueue.prevSongs[0]);
                await play.play(client, interaction, serverQueue.songs[0]);
            } catch (e) {
                console.log(e);
            }
        }
        return;
    }
}
//______________________________________________//
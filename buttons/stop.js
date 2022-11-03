//______________________________________________//
const { Colors } = require("discord.js");

//______________________________________________//
module.exports = {
    name: "stop",

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

        try {
            await interaction.update({
                embeds: [serverQueue.songs[0].embed],
                components: [],
            });
            await serverQueue.connection.disconnect();
            await client.queue.delete(interaction.guild.id);
            return;
        } catch (e) {
            console.log(e);
        }
        return;
    }
}
//______________________________________________//
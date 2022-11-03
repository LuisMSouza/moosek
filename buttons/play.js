//______________________________________________//
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");

//______________________________________________//
module.exports = {
    name: "play",

    async execute(client, interaction) {
        const button = new ButtonBuilder()
            .setCustomId("pause")
            .setEmoji("<:4210635:914638880492372009>")
            .setStyle(ButtonStyle.Secondary)
        const button4 = new ButtonBuilder()
            .setCustomId("play_2")
            .setEmoji("<:4210629:914638880798568548>")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);
        const button5 = new ButtonBuilder()
            .setCustomId("backward")
            .setEmoji("<:4210650:914638881184440350>")
            .setStyle(ButtonStyle.Secondary)
        const button6 = new ButtonBuilder()
            .setCustomId("forward")
            .setEmoji("<:4210646:914638880857272421>")
            .setStyle(ButtonStyle.Secondary)
        const button7 = new ButtonBuilder()
            .setCustomId("stop")
            .setEmoji("<:4210632:914638880827916339>")
            .setStyle(ButtonStyle.Secondary)

        const row3 = new ActionRowBuilder().addComponents(
            button,
            button4,
            button5,
            button6,
            button7
        );
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
        if (serverQueue.playing) return;
        if (serverQueue) {
            try {
                serverQueue.playing = true;
                serverQueue.audioPlayer.unpause();
                await interaction.update({
                    embeds: [serverQueue.songs[0].embed],
                    components: [row3],
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            await interaction.update({
                embeds: [serverQueue.songs[0].embed],
                components: [],
            });
        }
        return;
    }
}
//______________________________________________//
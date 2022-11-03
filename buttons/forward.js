//______________________________________________//
const { Colors } = require("discord.js");
const play = require("../structures/createPlayer.js");

//______________________________________________//
module.exports = {
    name: "forward",

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
            if (serverQueue.songs.length <= 1) {
                interaction.update({ embeds: [serverQueue.songs[0].embed] });
                serverQueue.songs.shift();
                await interaction.guild.members.me.voice.disconnect();
                await interaction.client.queue.delete(interaction.guild.id);
                return;
            } else if (serverQueue.songs.length > 1) {
                serverQueue.prevSongs = [];
                await serverQueue.prevSongs.push(serverQueue.songs[0]);
                if (serverQueue.looping) {
                    await serverQueue.songs.push(serverQueue.songs[0]);
                }
                if (serverQueue.nigthCore) {
                    var random = Math.floor(
                        Math.random() * serverQueue.songs.length
                    );
                    await play.play(client, interaction, serverQueue.songs[random]);
                    serverQueue.songs.splice(random, 1);
                    return interaction.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                }
                await interaction.update({ embeds: [serverQueue.songs[0].embed], components: [] });
                await serverQueue.songs.shift();
                await play.play(client, interaction, serverQueue.songs[0]);
                return;
            }
        } catch (e) {
            console.log(e);
            await serverQueue.songs.shift();
            await play.play(client, interaction, serverQueue.songs[0]);
            return interaction.reply({ content: "❌ **Erro ao reagir**", ephemeral: true });
        }
        return;
    }
}
//______________________________________________//
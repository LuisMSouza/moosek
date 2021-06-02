const { message } = require('../events/message.js');

module.exports = async (button) => {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (button.id === "pause_button") {
        if (!message.member.voice.channel) {
            serverQueue.textChannel.send({
                embed: {
                    color: "#701AAB",
                    description: "❌ **Você precisa estar em um canal de voz para reagir!**"
                }
            }).then(m => m.delete({ timeout: 10000 }));
            return;
        }
        if (serverQueue.connection.channel.id !== button.clicker.user.id) {
            serverQueue.textChannel.send({
                embed: {
                    color: "#701AAB",
                    description: "❌ **O bot está sendo utilizado em outro canal!**"
                }
            }).then(m2 => m2.delete({ timeout: 10000 }))
            return;
        }
        if (serverQueue) {
            try {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                button.defer();
                return undefined;
            } catch (e) {
                console.log(e);
            }
        } else {
            button.defer();
            return undefined;
        }
    } else if (button.id === "play_button") {

    } else if (button.id === "back_button") {

    } else if (button.id === "next_button") {

    } else if (button.id === "stop_button") {

    } else if (button.id === "repeat_button") {

    } else if (button.id === "loop_button") {

    } else if (button.id === "aleatory_button") {

    }
}
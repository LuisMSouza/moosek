/////////////////////// IMPORTS //////////////////////////
const guildData = require('../models/guildData.js');

/////////////////////// SOURCE CODE //////////////////////////
module.exports = async (client, oldState, newState, message, member) => {
    if (newState.member.id === client.user.id && !newState.connection) {
        const serverQueue = client.queue.get(newState.guild.id);
        client.radio.delete(newState.guild.id);
        client.queue.delete(newState.guild.id);
        await guildData.findOneAndUpdate({ guildID: newState.guild.id }, { $set: { aleatory_mode: false } }, { new: true });
    }
}
/////////////////////// IMPORTS //////////////////////////
const mongoose = require('mongoose');

/////////////////////// SOURCE CODE ///////////////////////////
const botSchema = mongoose.Schema({
    Recc: String,
    MoosekVersion: String,
    SpotifyTokenAcess: String,
    SpotifyClientId: String,
    SpotifyClientSecret: String,
});

module.exports = mongoose.model('confidentials', botSchema);
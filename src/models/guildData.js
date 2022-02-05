/////////////////////// IMPORTS //////////////////////////
import { Schema, model } from 'mongoose';

/////////////////////// SOURCE CODE ///////////////////////////
const guildSchema = Schema({
    guildID: String,
    guildPrefix: String,
    aleatory_mode: Boolean,
});

export default model('guildData', guildSchema);
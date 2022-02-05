/////////////////////// IMPORTS //////////////////////////
import { Schema, model } from 'mongoose';

/////////////////////// SOURCE CODE ///////////////////////////
const userSchema = Schema({
    userID: String,
    list: Array,
});

export default model('saveData', userSchema)
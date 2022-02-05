/////////////////////// IMPORTS //////////////////////////
import { findOneAndDelete } from './guildData.js';

/////////////////////// SOURCE CODE ///////////////////////////
export default async (guild) => {
    try {
        await findOneAndDelete({
            guildID: guild
        });
    } catch (e) {
        console.log(e);
    }
}
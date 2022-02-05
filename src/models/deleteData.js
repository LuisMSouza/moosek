/////////////////////// IMPORTS //////////////////////////
import { findOneAndDelete } from './userData.js';

/////////////////////// SOURCE CODE ///////////////////////////
export default async (client, member) => {
    try {
        findOneAndDelete({
            userID: member
        }, (err, res) => {
            if (err) console.log(err);
        });
    } catch (e) {
        console.log(e);
    }
}
/////////////////////// IMPORTS //////////////////////////
import userData from './userData.js';

/////////////////////// SOURCE CODE ///////////////////////////
export default async (client, member) => {
    try {
        const data = new userData({
            userID: member,
        });
        await data.save();
    } catch (e) {
        console.log(e);
    }
}
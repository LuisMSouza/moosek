/////////////////////// IMPORTS //////////////////////////
const userData = require('./userData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (client, member) => {
    const data = new userData({
        userID: member,
    });
    await data.save();
}
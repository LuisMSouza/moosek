/////////////////////// IMPORTS //////////////////////////
const userData = require('./userData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (client, member, songUrl) => {
    await userData.findOneAndUpdate({ userID: member }, { $set: { list: songUrl++ } }, { new: true });
}
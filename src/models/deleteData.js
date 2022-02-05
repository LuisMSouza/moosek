/////////////////////// IMPORTS //////////////////////////
const userData = require('./userData.js');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (client, member) => {
    try {
        userData.findOneAndDelete({
            userID: member
        }, (err, res) => {
            if (err) console.log(err);
        });
    } catch (e) {
        console.log(e);
    }
}
/////////////////////// IMPORTS //////////////////////////
const botData = require('./botData');

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async () => {
    try {
        const data = new botData();
        await data.save();
    } catch (e) {
        console.log(e);
    }
}
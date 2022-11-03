/////////////////////// IMPORTS //////////////////////////
const userData = require("./userData.js");

/////////////////////// SOURCE CODE ///////////////////////////
module.exports = async (client, member) => {
  try {
    const data = new userData({
      userID: member,
    });
    await data.save();
  } catch (e) {
    console.log(e);
  }
};

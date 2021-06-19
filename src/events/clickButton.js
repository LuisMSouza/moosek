module.exports = async (button) => {
    try {
        switch (button.id) {
            case "stop_radio":
                console.log("event on!");
                await button.defer();
                break;
        }
    } catch (e) {
        console.log(e);
    }
}
module.exports = async (button) => {
    try {
        switch (button.id) {
            case "stop_radio":
                await button.defer();
                console.log("event on!")
                break;
        }
    } catch (e) {
        console.log(e);
    }
}
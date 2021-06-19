module.exports = async (button) => {
    try {
        await button.defer(true);
        switch (button.id) {
            case "stop_radio":
                console.log("event on!")
                break;
        }
    } catch (e) {
        console.log(e);
    }
}
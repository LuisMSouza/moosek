module.exports = async (button) => {
    try {
        await button.defer();
        switch (button.id) {
            case "radio_stop":
                console.log("event on!")
                break;
        }
    } catch (e) {
        console.log(e);
    }
}
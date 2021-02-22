const input = document.getElementById("input");
const button = document.getElementById("getStatus");
const modal = new bootstrap.Modal(document.getElementById('statusModal'), {});

const parseDescription = function(description) {
    let desc = "";
    if (typeof description === "string") {
        desc = description;
        return desc;
    }
    description.extra = description.extra || [];
    description.text = description.text || "";
    for (let extraIndex in description.extra) {
        desc += description.extra[extraIndex].text + "\n";
    }
    desc += description.text;
    return desc;
}

const getStatus = async function() {
    let value = input.value;
    input.value = "";
    button.innerText = "Pinging...";
    try {
        document.getElementById("errorMsg").setAttribute("style", "display: none");
        let status = await axios.get(`/status/${value}`);
        if (status.data.error) {
            document.getElementById("errorMsg").setAttribute("style", "display: inherit");
            button.innerText = "Get Status";
            return;
        }
        document.getElementById("statusIp").innerText = value;
        document.getElementById("statusVersion").innerText = JSON.stringify(status.data.version.name);
        document.getElementById("statusPlayers").innerText = JSON.stringify(status.data.players.online) + "/" + JSON.stringify(status.data.players.max);
        document.getElementById("statusMOTD").innerText = parseDescription(status.data.description);
        modal.show();
        button.innerText = "Get Status";
    } catch (err) {
        console.log(err);
        document.getElementById("errorMsg").setAttribute("style", "display: inherit");
        button.innerText = "Get Status";
    }
}

input.addEventListener("keyup", async (evt) => {
    if (evt.key === "Enter") {
        await getStatus();
    }
});

button.addEventListener("click", async (evt) => {
    await getStatus();
})

let exampleJSON = {
    "version": {
        "name": "Waterfall 1.8.x, 1.9.x, 1.10.x, 1.11.x, 1.12.x, 1.13.x, 1.14.x, 1.15.x, 1.16.x",
        "protocol": 736
    },
    "players": {"max": 1337, "online": 2},
    "description": {"extra": [{"text": "UninvitedSF Community Server"}], "text": ""},
    "modinfo": {"type": "FML", "modList": []},
    "ping": 13
}

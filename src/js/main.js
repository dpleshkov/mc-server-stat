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
const parsePlayerListSample = function(sample) {
    let output = "";
    if (typeof sample !== "object") {
        return output;
    }
    for (let playerIndex in sample) {
        output += "\n" + sample[playerIndex].name;
    }
    return output;
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
        if (status.data.players.sample) {
            let playerList = parsePlayerListSample(status.data.players.sample);
            console.log(playerList);
            if (playerList.length) {
                document.getElementById("statusPlayersSample").innerText = playerList;
                document.getElementById("statusPlayersSampleSpan").setAttribute("style", "display: inherit");
            } else {
                document.getElementById("statusPlayersSampleSpan").setAttribute("style", "display: none");
            }
        } else {
            console.log("Tf");
            document.getElementById("statusPlayersSampleSpan").setAttribute("style", "display: none");
        }
        console.log(status.data);
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
});

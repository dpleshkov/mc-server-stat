const express = require("express");
const pinger = require("minecraft-pinger");
const path = require("path");
const app = express();
const port = 3000;
app.use(express.static("src"));
app.use(express.json());

app.get("/", async(req, res) => {
    return res.sendFile(path.join(__dirname, "/src/html/index.html"));
});

app.get("/status/:ip", async(req, res) => {
    let ip = req.params.ip;
    let hostname = ip.split(":")[0];
    let port = Number(ip.split(":")[1]) || 25565;
    try {
        let status = await pinger.pingPromise(hostname, port);
        console.log(JSON.stringify(status));
        return res.json(status);
    } catch(err) {
        return res.json({"error":true});
    }
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Now listening on port ${port}`);
});

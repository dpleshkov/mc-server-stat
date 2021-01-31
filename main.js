const express = require("express");
const pinger = require("minecraft-pinger");
const path = require("path");
const app = express();
const port = 3000;
app.use(express.static("src"));
app.use(express.json());

app.get("/", (req, res) => {
    console.log("request");
    res.sendFile(path.join(__dirname, "/src/html/index.html"));
})

pinger.ping('pleshkov.dev', 25565, (error, result) => {
    if (error) return console.error(error)
    console.log(JSON.stringify(result))
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Now listening on port ${port}`);
});

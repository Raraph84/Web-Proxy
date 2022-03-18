const Http = require("http");
const Https = require("https");
const Config = require("./config.json");

const server = Http.createServer((req, res) => {

    let data = "";
    req.on("data", (chunk) => data += chunk);
    req.on("end", () => {

        const headers = req.headers;
        headers.host = Config.host.split("/")[2];

        (Config.host.startsWith("https") ? Https : Http).request(Config.host + req.url, { method: req.method, headers }, (result) => {

            res.writeHead(result.statusCode, result.headers);
            result.pipe(res, { end: true });

        }).end(data);
    });
});

server.listen(Config.port, () => console.log("Proxy launched on port " + Config.port + " !"));
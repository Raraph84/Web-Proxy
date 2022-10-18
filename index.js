const Http = require("http");
const Https = require("https");

const server = Http.createServer((req, res) => {

    let data = "";
    req.on("data", (chunk) => data += chunk);
    req.on("end", () => {

        try {

            const url = req.url.slice(req.url.startsWith("/") ? 1 : 0);

            const host = req.headers.host;
            delete req.headers.host;

            (url.split(":")[0] === "https" ? Https : Http).request(url, { method: req.method, headers: req.headers }, (result) => {

                if (result.statusCode === 301 || result.statusCode === 302)
                    result.headers.location = "http://" + host + "/" + result.headers.location;

                res.writeHead(result.statusCode, result.headers);
                result.pipe(res);

            }).end(data);

        } catch (error) {

            res.writeHead(400);
            res.end("Invalid proxy request or the requested server is down.");
        }
    });
});

server.listen((process.env.PORT || 8080), () => console.log("Proxy launched on port " + (process.env.PORT || 8080) + " !"));

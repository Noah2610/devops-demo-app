const fs = require("fs/promises");
const http = require("http");
const path = require("path");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8080;

/**
 * @typedef {(req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>} Route
 */

/**
 * @type {Map<string, [string | RegExp, Route][]>}
 */
const ROUTES = new Map([
    [
        "GET",
        [
            ["/", rootRoute],
            [/\/.+\.(js|css|png|jpg)$/, assetRoute],
        ],
    ],
]);

/** @param {http.IncomingMessage} req */
function getRoute(req) {
    const method = req.method;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const routes = ROUTES.get(method);
    if (!routes) {
        return notFoundRoute;
    }

    const route = routes.find(
        ([pattern]) =>
            (typeof pattern === "string" && path === pattern) ||
            (pattern.constructor.name === "RegExp" && pattern.test(path)),
    )?.[1];

    return route || notFoundRoute;
}

/** @type {Route} */
async function rootRoute(req, res) {
    const content = await fs.readFile("./public/index.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(content);
    res.end();
}

/** @type {Route} */
async function assetRoute(req, res) {
    const filePathRel = req.url.replace(/^\//, "");
    const filePath = path.resolve(`${__dirname}/public/${filePathRel}`);
    const extension = filePath.split(".").pop();
    const contentType = getContentTypeForExtension(extension);

    if (!contentType) {
        throw new Error(`Invalid asset extension: "${extension}"`);
    }

    const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
    if (!fileExists) {
        return notFoundRoute(req, res, "Asset not found: ");
    }

    const content = await fs.readFile(filePath, "utf8");

    res.writeHead(200, { "Content-Type": contentType });
    res.write(content);
    res.end();
}

function getContentTypeForExtension(extension) {
    switch (extension.toLowerCase()) {
        case "js":
            return "text/javascript";
        case "css":
            return "text/css";
        case "png":
            return "image/png";
        case "jpg":
            return "image/jpeg";
        default:
            return null;
    }
}

/** @type {Route} */
function notFoundRoute(req, res, prefix = "Route not found: ") {
    res.writeHead(404);
    res.write(`${prefix}${req.method} ${req.url}`);
    res.end();
}

const server = http.createServer((req, res) => {
    const route = getRoute(req);
    if (!route) {
        const routeName = `${req.method} ${req.url}`;
        throw new Error(`Route not found for ${routeName}`);
    }

    const promise = route(req, res);

    if (promise) {
        promise.catch((err) => {
            console.error(err);
            res.writeHead(500, "Internal Server Error", {
                "Content-Type": "text/plain",
            });
            res.write("500 Internal Server Error");
            res.end();
        });
    }
});

server.listen(PORT, HOST, () => {
    const addr = server.address();
    console.log(`Server running on\n  http://${addr.address}:${addr.port}`);
});

const http = require("http");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;

/**
 * @typedef {(req: http.IncomingMessage, res: http.ServerResponse) => void} Route
 */

/**
 * @type {Map<string, [string | RegExp, Route][]>}
 */
const ROUTES = new Map([
    [
        "GET",
        [
            ["/", rootRoute],
            [/\.js$/, jsRoute],
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

function rootRoute() {}

function jsRoute(req, res) {}

function notFoundRoute() {}

const server = http.createServer((req, res) => {
    const route = getRoute(req);
    if (!route) {
        console.error(`Route not found for ${req.method} ${req.url}`);
        return;
    }

    route(req, res);
});

server.listen(PORT, HOST, () => {
    const addr = server.address();
    console.log(`Server running on\n  http://${addr.address}:${addr.port}`);
});

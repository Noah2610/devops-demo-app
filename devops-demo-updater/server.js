const cp = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 8081;
const UPDATE_SCRIPT = path.resolve(
    __dirname + "/../bin/update.sh",
);

let isRunningScript = false;

validateScript(UPDATE_SCRIPT);

const server = http.createServer((req, res) => {
    if (req.method !== "GET" || req.url !== "/update-devops-demo-app") {
        handleRequestInvalid(req, res);
        return;
    }

    if (runScript(UPDATE_SCRIPT)) {
        handleRequestUpdating(req, res);
    } else {
        handleRequestAlreadyUpdating(req, res);
    }
});

function handleRequestInvalid(req, res) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("400 Invalid Request");
    res.end();
}

function handleRequestUpdating(req, res) {
    res.writeHead(202, { "Content-Type": "text/plain" });
    res.write("Updating app...");
    res.end();
}

function handleRequestAlreadyUpdating(req, res) {
    res.writeHead(202, { "Content-Type": "text/plain" });
    res.write("Still updating app...");
    res.end();
}

function runScript(script) {
    if (isRunningScript) {
        return false;
    }

    console.log("[Info]\nRunning update script");

    isRunningScript = true;
    const proc = cp.spawn(script, { detached: true, stdio: "inherit" });

    proc.on("exit", (code) => {
        isRunningScript = false;
        if (code === 0) {
            console.log("[Info]\nFinished update");
        } else {
            console.log("[Info]\nFailed update");
        }
    });

    return true;
}

function validateScript(script) {
    if (!isScriptExecutable(script)) {
        throw new Error(
            `[Error]\nUpdate script doesn't exist or is not executable:\n  ${script}`,
        );
    }
}

function isScriptExecutable(script) {
    try {
        fs.accessSync(script, fs.constants.X_OK);
        return true;
    } catch (_) {
        return false;
    }
}

server.listen(PORT, HOST, () => {
    const addr = server.address();
    console.log(
        `Updater server running on\n  http://${addr.address}:${addr.port}`,
    );
});

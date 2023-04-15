const http = require("http").createServer();
const pty = require("node-pty");
const os = require("os");
const ip = require("ip");

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const io = require("socket.io")(http, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env,
    });

    ptyProcess.onData((data) => {
        io.emit("terminal.incomingData", data);
    })

    socket.on("terminal.keystroke", (data) => {
        ptyProcess.write(data);
    });
});

http.listen(1234, ip.address(), () => console.log(`Listening on http://${ip.address()}:1234`));

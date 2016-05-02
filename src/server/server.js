
import "source-map-support/register";

import express from "express";
import http from "http";
import socketIo from "socket.io";

const isDevelopment = process.env.NODE_ENV !== "production";
// ----------------------
// Set update
const app = express();
const server = new http.Server(app);
const io = socketIo(server);


// ----------------------
// Client Webpack

// ----------------------
// Configure Express
app.set("view engine", "jade");
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
app.get("/", (req, res) => {
    res.render("index", {
        useExternalStyles
    });
});

// ----------------------
// Modules

// ----------------------
// Socket

io.on("connection", socket => {
    console.log(`GOT connection from ${socket.request.connection.remoteAddress}`);
});

// ----------------------
// Startup
const port = process.env.Port || 3000;
function startServer() {
    server.listen(port, () => {
        console.log(`started http server on ${port}`);
    });
}

startServer();

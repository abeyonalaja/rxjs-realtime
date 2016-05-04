
import "source-map-support/register";
import chalk from "chalk";

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
if(process.env.USE_WEBPACK === "true") {
    var webpackMiddleware = require("webpack-dev-middleware"),
        webpackHotMiddleware = require("webpack-hot-middleware"),
        webpack = require("webpack"),
        clientConfig = require("../../webpack.client");

    const compiler = webpack(clientConfig);
    app.use(webpackMiddleware(compiler,{
        publicPath: "/build",
        stats: {
            colors: true,
            chunks: false,
            assets: false,
            timings: false,
            modules: false,
            hash: false,
            version: false
        }
    }));

    app.use(webpackHotMiddleware(compiler));

    console.log(chalk.bgRed("Using WebPack Dev Middleware! THIS IS FOR DEV ONLY"));
}

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

    let index = 0;
    setInterval(() => {
        socket.emit("test", `On Index ${ index++ }`);
    }, 1000);
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

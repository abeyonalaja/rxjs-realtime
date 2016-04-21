
import gulp from "gulp";
import webpack from "webpack";
import chalk from "chalk";
import rimraf from "rimraf";
import {create as createServerConfig} from "./webpack.server";

const $ = require("gulp-load-plugins")();


// -----------------------------
// Public Tasks
gulp.task("clean:server", cb => rimraf("./build", cb));
gulp.task("clean:client", cb => rimraf("./public/build", cb));
gulp.task("clean", ["clean:server", "clean:client"]);

gulp.task("dev:server", ["clean:server"], devServerBuild);

gulp.task("prod:server", ["clean:server"], prodServerBuild);

// -----------------------------
// Private Server tasks
const devServerWebpack = webpack(createServerConfig(true));
gulp.task("dev", ["clean", devServerBuild])

function devServerWatch() {
    devServerWebpack.watch({}, (error, stats) => {
        outputWebpack("Dev:Server", error, stats);
    });
}

function devServerReload() {
    return $.nodemon({
        script: "./build/server.js",
        watch: "./build",
        env: {
            "NODE_ENV": "development",
            "USE_WEBPACK": "true"
        }
    });
}

function devServerBuild(callback){
    devServerWebpack.run((error, stats) => {
        outputWebpack("Dev:Server", error, stats);
        callback();
    })
}


function prodServerBuild(callback){
    const prodServerWebpack = webpack(createServerConfig(false));
    prodServerWebpack.run((error, stats) => {
        outputWebpack("Prod:Server", error, stats);
        callback();
    });
}

function outputWebpack(label, error, stats){
    if(error)
        throw new Error(error)

    if(stats.hasErrors()) {
        $.util.log(stats.toString( { colors: true }))
    } else {
        const time = stats.endTime - stats.startTime
        $.util.log(chalk.bgGreen(`Built ${label} in ${ time } ms`))
    }
    
    // $.util.log(stats.toString());
}

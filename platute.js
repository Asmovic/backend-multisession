require("events").EventEmitter.defaultMaxListeners = Infinity;

const express = require("express"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express(),
    cors = require("cors"),
    fs = require("fs"),
    logger = require("morgan"),
    chalk = require("chalk"),
    path = require("path"),
    requestIp = require('request-ip'),
    compression = require("compression"),
    CronJob = require("cron").CronJob;
    require("dotenv").config();

const connectToMongoDB = require("./Utilities/mongooseConfig").connect();
setGlobalPathForRootDir();

const studentAuthRoute = require("./Routes/studentAuth");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
 app.use(cookieParser());

app.use( 
    session({
      secret: [process.env.COOKIE_SECRET_KEY],
      resave: false,
      saveUninitialized: true
    })
  );

function setGlobalPathForRootDir() {
    global.baseDir = path.resolve(__dirname);
}

app.use(compression());
app.use("/student-auth", studentAuthRoute);

const server = require("http").createServer(app);

(async function () {
    await connectToMongoDB;
    exposeServerToPort();
})()

function exposeServerToPort() {
    server.listen(80, function () {
        console.log("app listening on port:" + 80);
    });
}
const express = require("express");
const app = express();
const appConfig = require("./config/main-config.js")
const routeConfig = require("./config/route-config.js");

app.set("view engine", "pug")
app.use(require("body-parser").urlencoded({extended: false}));

appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;
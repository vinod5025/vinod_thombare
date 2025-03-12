var express = require("express");
var bodyParser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");
var user_route = require("./routes/user_route");
var admin_route = require("./routes/admin_route");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());
app.use(session({
    secret: "23456",
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public/"));

app.use("/", user_route);
app.use("/admin", admin_route);
app.listen(1000)

var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require('dotenv');
var upload = require("express-fileupload");
var session = require("express-session");
const path = require('path');
dotenv.config();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());
app.use(session({
    secret: "23456",
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public/"));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
var user_route = require("./routes/user_route");
var admin_route = require("./routes/admin_route");
app.use("/", user_route);
app.use("/admin", admin_route);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

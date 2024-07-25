const express = require('express');

const app = express();


const branchRoute = require("./routes/branches");
const userRoute = require("./routes/users");
const masterRoute = require("./routes/master");
const procedureRoute = require("./routes/procedures");


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/branch", branchRoute);
app.use("/master", masterRoute);
app.use("/procedure", procedureRoute);


module.exports = app;

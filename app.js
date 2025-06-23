const express = require("express");
//const cors = require("cors");

const { HandlePostgresErrors, HandleCustomErrors, HandleServerErrors } = require("./errors/errorHandling.js");

const apiRouter = require("./routers/api.router.js");
const app = express();

//app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.use("/api", apiRouter);

app.use(HandlePostgresErrors);

app.use(HandleCustomErrors);

app.use(HandleServerErrors);

module.exports = app;

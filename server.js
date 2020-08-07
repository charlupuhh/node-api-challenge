const express = require("express");
const server = express();

const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "It works" });
});

server.use("/projects", projectRouter);
server.use("/actions", actionRouter);

module.exports = server;
// implement your server here
// require your posts router and connect it here

const express = require("express");
const postRouter = require("../api/posts/posts-router");
const cors = require("cors");

const server = express();
server.use(express.json());

// CORS middleware'i
server.use(cors());

// postRouter'ı '/api/posts' yoluna yönlendir
server.use("/api/posts", postRouter);

module.exports = server;

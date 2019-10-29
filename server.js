const express = require('express');
const server = express();
const router = require('./routers/routers')
server.use(express.json());

server.use('/api/posts', router)

server.get('*', handleDefaultRequest)

function handleDefaultRequest (req, res) {
    res.json("Hello there")
}

module.exports = server;
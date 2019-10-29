const server = require('./server')

server.listen(process.env.PORT || 2000, () => {
    console.log('port is listening on ' + (process.env.PORT || 2000))
})
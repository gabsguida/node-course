const http = require('http');
const routes = require('./routes');

//a função anonima é executada sempre que houver um request que alcança nosso server, se não houver process.exit
const server = http.createServer(routes);

server.listen(3000);

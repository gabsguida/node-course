const fs = require('fs')

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if(url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk)
            body.push(chunk)
        })
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            // parsedBody retorna a lista de chunks. Node realiza o parse (analise) do body por meio de chunks, para que você consiga pegar esse resultado antes do body ser totalmente analisado
           // console.log(parsedBody) // retorna o valor que é inserido no input. Ex.: message=some text, onde "message" é o name do input e "some text" o valor inserido dentro do input
            const message = parsedBody.split('=')[1]
            fs.writeFile('message.txt', message, (error) => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            }) 
            /* fs.writeFileSync-> cria um novo arquivo com o valor inserido pelo input de forma síncrona, ou seja, 
            vai parar a execução da função até que haja um retorno aqui. Uma forma de evitar que o server fique "parado", é usar fs.writeFile, que é assíncrono */
        })
        
        
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end(); // encerra a escrita. 
}

module.exports = requestHandler;
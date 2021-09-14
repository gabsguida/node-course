const fs = require('fs');
const path = require('path');
const rootPath = require('../util/path')


// pega o path correto de data/products.json
const p = path.join(rootPath, 'data', 'products.json')

const getProductsFromFile = cb => {
    fs.readFile(p, (err, data) => {
        if(err) {
            return cb([]);
        }
        cb(JSON.parse(data))
    })
}

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
         // lê o arquivo products.json dentro do path correto 
        // se não houver erro, o dada é formatado
        // em seguida é adicionado ao array products o que foi enviado no form (dentro da função do controller, envia o req.body.title)
        // o this carrega toda informação inserida no constructor, então quando é fornecido no form (view) irá receber devido ao new Product(value)
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            });
        })
    }
    

   // uso do static permite chamar fora da instância, ou seja, não precisa criar um novo produto (new Product('First Book'), por exemplo) 
   // precisa passar um callback como argumento da função, pois o retorno é assincrono e entao products se tornará undefined, já q a função segue e não para no callback do fs.readFile
    static fetchAll(cb) {
        getProductsFromFile(cb)
    }
}
const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

/**
 *
 * @param {*} cb callback
 */
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      let updatedProducts = [...products];

      if (this.id) {
        const index = products.findIndex((product) => product.id === this.id);

        updatedProducts[index] = this;
      } else {
        this.id = Math.random().toString();
        updatedProducts.push(this);
      }

      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  /**
   * 
   * @param {*} id Deleted product id used to update the products list
   * and to update the cart list
   */
  static deleteById(id) {
    getProductsFromFile((products) => {
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if(!err) {
          Cart.deleteProduct(id)
        }
      });
    });
  }

  /**
   *
   * @param {*} id product id
   * @param {*} cb callback that returns the filtered product
   */
  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      // callback
      cb(product);
    });
  }
};

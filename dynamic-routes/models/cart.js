const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      let updatedProduct;

      // Analyze the cart => find existing product
      if (cart.products) {
        const existingProductIndex = cart.products.findIndex(
          (product) => product.id === id
        );
        const existingProduct = cart.products[existingProductIndex];

        // Add new product / increase quantity
        if (existingProduct) {
          updatedProduct = { ...existingProduct };
          updatedProduct.quantity = updatedProduct.quantity + 1;
          updatedProduct.price = productPrice;
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        } else {
          updatedProduct = { id: id, quantity: 1, price: productPrice };
          cart.products = [...cart.products, updatedProduct];
        }

        cart.totalPrice = cart.totalPrice + +productPrice;
      } else {
        updatedProduct = { id: id, quantity: 1, price: productPrice };
        cart.totalPrice = +productPrice;
        cart.products = [updatedProduct];
      }

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log("error", err);
      });
    });
  }

  /**
   * 
   * @param {*} id used to filter the product that will be deleted
   */
  static deleteProduct(id) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      // get the current cart
      let cart = { ...JSON.parse(fileContent) };

      // verify if cart is not empty to delete the product
      if (cart.products) {
        // filter the desire product to be deleted
        const productIndex = cart.products.findIndex(
          (product) => product.id === id
        );
        // if not exist so dont move on
        if (productIndex === -1) return;

        const productQty = cart.products[productIndex].quantity;
        const productPrice = cart.products[productIndex].price;
        const totalPrice = cart.totalPrice - productPrice * productQty;

        cart.totalPrice =
          totalPrice != null && totalPrice > 0 ? totalPrice : "";

        cart.products.splice(productIndex, 1);
          
        // update the cart file with new cart
        fs.writeFile(p, JSON.stringify(cart), (err) => {
          console.log(err);
        });
      }
    });
  }

  /**
   * 
   * @param {*} cb callback that contains the cart
   */
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};

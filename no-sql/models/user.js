const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  let updatedCart;

  // carrinho existe
  if (this.cart != null && this.cart.items != null) {
    const cartItemsCopy = [...this.cart.items];

    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    // produto já existe, então precisa atualizar a quantidade
    if (cartProductIndex > -1) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      cartItemsCopy[cartProductIndex].quantity = newQuantity;
    } else {
      // se não existe, então adiciona-o dentro da lista completa
      cartItemsCopy.push({
        productId: product._id,
        quantity: 1,
      });
    }

    updatedCart = {
      items: cartItemsCopy,
    };
  } else {
    // carrinho não existe ainda, então precisa cria-lo
    updatedCart = {
      items: [{ productId: product._id, quantity: 1 }],
    };
  }

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteProductCart = function (productId) {
  const cartItemsCopy = [...this.cart.items];

  const index = this.cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  cartItemsCopy.splice(index, 1);

  this.cart.items = cartItemsCopy;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

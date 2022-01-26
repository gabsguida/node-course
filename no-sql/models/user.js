const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email, cart, userId) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this.userId = ObjectId(userId);
  }

  save() {
    const db = getDb();

    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  addToCart(product) {
    let newQuantity = 1;
    let updatedCart;
    const db = getDb();

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
          productId: ObjectId(product._id),
          quantity: 1,
        });
      }

      updatedCart = {
        items: cartItemsCopy,
      };
    } else {
      // carrinho não existe ainda, então precisa cria-lo
      updatedCart = {
        items: [{ productId: ObjectId(product._id), quantity: 1 }],
      };
    }

    return db
      .collection("users")
      .updateOne({ _id: this.userId }, { $set: { cart: updatedCart } })
      .then((updatedUser) => {
        //console.log(updatedUser);
      })
      .catch((error) => {
        throw new Error("Houve um problema");
      });
  }

  getCart() {
    const db = getDb();

    const items = this.cart.items != null ? this.cart.items : [];

    // uso do $in do mongo para pegar os produtos que dão match com a lista de ids dos produtos que estão no carrinho
    return db
      .collection("products")
      .find({
        _id: { $in: items.map((item) => ObjectId(item.productId)) },
      })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (item) => item.productId.toString() === product._id.toString()
            ).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  deleteProductCart(productId) {
    const db = getDb();

    const cartItemsCopy = [...this.cart.items];

    const index = this.cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    cartItemsCopy.splice(index, 1);

    return db
      .collection("users")
      .updateOne(
        { _id: this.userId },
        { $set: { cart: { items: cartItemsCopy } } }
      )
      .then((result) => {})
      .catch((err) => console.log(error));
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: { _id: this.userId, name: this.username },
        };

        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };

        return db
          .collection("users")
          .updateOne({ _id: this.userId }, { $set: { cart: { items: [] } } });
      });
  }

  getOrders() {
    const db = getDb();

    return db.collection("orders").find({ "user._id": this.userId }).toArray();
  }

  static getUser(id) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: ObjectId(id) })
      .then((user) => {
        //console.log(user, "user");
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;

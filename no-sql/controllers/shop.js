const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.find()
    //.select('title price -_id') -> irá trazer somente o title e price, excluindo o _id
    //.populate("userId") // irá trazer as informações de userId preenchida, com seu objeto completo (pois está usando o ref no model)
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = async (req, res, next) => {
  await req.user
    .populate("cart.items.productId")
    .then((user) => {
      //console.log(user.cart.items);
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      //console.log(result, 'addToCart')
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteProductCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = async (req, res, next) => {
  await req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          quantity: item.quantity,
          product: { ...item.productId._doc },
        };
      });
      const order = new Order({
        userId: req.user._id,
        products,
      });

      return order.save();
    })
    .then((result) => {
      req.user
        .clearCart()
        .then((clearCart) => {
          res.redirect("/orders");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

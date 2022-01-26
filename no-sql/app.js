const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongoClient = require("./util/database").connectMongo;
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.getUser("61e73cedf45b7270dc9f7deb")
    .then((user) => {
      if (user.cart == null) {
        user.cart = { items: [] };
      }

      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoClient(() => {
  app.listen({ port: 3000 }, () =>
    console.log(`🚀 Application ready at http://localhost:3000`)
  );
});

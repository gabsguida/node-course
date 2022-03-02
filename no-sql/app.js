const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const User = require("./models/user");

const mongoose = require("mongoose");
const { MONGODB_KEY } = require("./mongo_key");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("620acf586790e4828d282802")
    .then((user) => {
      if (user.cart == null) {
        user.cart = { items: [] };
      }

      req.user = user
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_KEY)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Gabriela",
          email: "email@email.com",
          cart: {
            items: [],
          },
        });

        user.save();
      }
    });

    app.listen({ port: 3000 }, () =>
      console.log(`🚀 Application ready at http://localhost:3000`)
    );
  })
  .catch((err) => {
    console.error(err)
    throw err
  });

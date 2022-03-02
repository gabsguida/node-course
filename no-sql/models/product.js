const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

module.exports = mongoose.model("Product", productSchema);

// const getDb = require("../util/database").getDb;
// const { ObjectId } = require("mongodb");

// class Product {
//   constructor(title, price, description, imageUrl, id = null, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = ObjectId(userId);

//     if (id != null) {
//       this._id = ObjectId(id);
//     }
//   }

//   upsertProduct() {
//     const db = getDb();
//     let dbOp;

//     // atualiza o produto
//     if (this._id != null) {
//       dbOp = db.collection("products").updateOne(
//         { _id: this._id },
//         {
//           $set: this,
//         }
//       );
//     } else {
//       // insere a collection -> se não tiver criado, o mongo irá criar automaticamente quando for usado
//       dbOp = db.collection("products").insertOne(this);
//     }

//     return dbOp
//       .then((result) => console.log(result))
//       .catch((error) => console.log(error));
//   }

//   /**
//    * não retorna uma promise, mas retorna o primeiro batch de resultado e o cursor id.
//    * Para retornar a lista completa (pois usando somente a query "find", o mongo retorna os dados em "partes", pra
//    * não sobrecarregar), usa-se a query "toArray", que é bom para implementar paginação.
//    *
//    * static -> são métodos da classe que não alteram/criam em si o objeto. Por exemplo, um método de criação desse objeto
//    * não é static, mas um método que busca todos os valores pode ser static, pois não está alterando o objeto.
//    * Para mais informações: https://javascript.info/static-properties-methods
//    */
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         //console.log(products);
//         return products;
//       })
//       .catch((error) => console.log(error));
//   }

//   static getProduct(id) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .find({ _id: ObjectId(id) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteProduct(id) {
//     const db = getDb();

//     return db
//       .collection("products")
//       .deleteOne({ _id: ObjectId(id) })
//       .then((result) => {
//         return result;
//       })
//       .catch((error) => console.log(error));
//   }
// }

// module.exports = Product;

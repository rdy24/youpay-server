const mongoose = require("mongoose");
let productSchema = mongoose.Schema({
  judul: {
    type: String,
    require: [true, "Judul Harus diisi"],
  },
  icon: {
    type: String,
  },
});

module.exports = mongoose.model("product", productSchema);

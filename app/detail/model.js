const mongoose = require("mongoose");
let detailSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  item: {
    type: String,
    require: [true, "Item game harus diisi"],
  },
  backdrop: {
    type: String,
  },
  description: {
    type: String,
    require: [true, "Deskripsi harus diisi"],
  },
});

module.exports = mongoose.model("Detail", detailSchema);

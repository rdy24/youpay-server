const mongoose = require("mongoose");
let productSchema = mongoose.Schema(
  {
    game: {
      type: String,
      require: [true, "Nama Game Harus diisi"],
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

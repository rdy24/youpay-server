const mongoose = require("mongoose");
let articleSchema = mongoose.Schema(
  {
    judul: {
      type: String,
      require: [true, "Judul Artikel harus diisi"],
    },
    image: {
      type: String,
    },
    excrept: {
      type: String,
      require: [true, "excrept harus diisi"],
    },
    body: {
      type: String,
      require: [true, "body harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);

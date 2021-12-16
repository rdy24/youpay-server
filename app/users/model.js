const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email harus diisi"],
    },
    name: {
      type: String,
      require: [true, "nama harus diisi"],
    },
    password: {
      type: String,
      require: [true, "kata sandi harus diisi"],
    },
    role: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    status: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

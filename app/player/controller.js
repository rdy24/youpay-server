const Product = require("../product/model");
const Detail = require("../detail/model");
const Article = require("../article/model");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const detail = await Detail.find()
        .select("_id game icon")
        .populate("product");

      res.status(200).json({ data: detail });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const detail = await Detail.findOne({ _id: id }).populate("product");
      if (!detail) {
        return res
          .status(404)
          .json({ message: "detail game tidak ditemukan.!" });
      }

      res.status(200).json({ data: detail });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  articlePage: async (req, res) => {
    try {
      const article = await Article.find();

      res.status(200).json({ data: article });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
  articledetailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const article = await Article.findOne({ _id: id }).select(
        "_id judul image body"
      );
      if (!article) {
        return res.status(404).json({ message: "article tidak ditemukan.!" });
      }

      res.status(200).json({ data: article });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },
};

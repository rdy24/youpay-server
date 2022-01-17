const Product = require("../product/model");
const Article = require("../article/model");
module.exports = {
  index: async (req, res) => {
    try {
      const product = await Product.countDocuments();
      const article = await Article.countDocuments();
      res.render("admin/dashboard/view_dashboard", {
        name: req.session.user.name,
        title: "Youpay Admin | Dashboard",
        count: {
          product,
          article,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};

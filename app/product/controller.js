const Product = require("./model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const product = await Product.find();
      res.render("admin/product/view_product", {
        product,
        alert,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/product/create");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { judul, icon } = req.body;

      let tmp_path = req.file.path;
      let originaExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originaExt;
      let target_path = path.resolve(
        config.rootPath,
        `public/uploads/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          const product = new Product({
            judul,
            icon: filename,
          });

          await product.save();
          req.flash("alertMessage", "Berhasil Menambah Data");
          req.flash("alertStatus", "success");
          res.redirect("/product");
        } catch (err) {
          req.flash("alertMessage", `${err.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/product");
        }
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ _id: id });
      res.render("admin/product/edit", {
        product,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, icon } = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const product = await Product.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${product.thumbnial}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Product.findOneAndUpdate(
              {
                _id: id,
              },
              {
                judul,
                icon: filename,
              }
            );
            req.flash("alertMessage", "Berhasil Ubah Data");
            req.flash("alertStatus", "success");
            res.redirect("/product");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/product");
          }
        });
      } else {
        await Product.findOneAndUpdate(
          {
            _id: id,
          },
          {
            judul,
          }
        );
        req.flash("alertMessage", "Berhasil Ubah Data");
        req.flash("alertStatus", "success");
        res.redirect("/product");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Product.findOneAndRemove({
        _id: id,
      });
      req.flash("alertMessage", "Berhasil Hapus Data");
      req.flash("alertStatus", "success");
      res.redirect("/product");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/product");
    }
  },
};

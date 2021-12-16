const Product = require("../product/model");
const Detail = require("./model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      const detail = await Detail.find().populate("product");

      res.render("admin/detail/view_detail", {
        detail,
        alert,
        name: req.session.user.name,
        title: "Youpay Admin | Detail Product",
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const product = await Product.find();
      res.render("admin/detail/create", {
        product,
        name: req.session.user.name,
        title: "Youpay Admin | Tambah Detail",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { product, item, description } = req.body;

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
          const detail = new Detail({
            product,
            item,
            description,
            backdrop: filename,
          });

          await detail.save();
          req.flash("alertMessage", "Berhasil Menambah Data");
          req.flash("alertStatus", "success");
          res.redirect("/detail");
        } catch (err) {
          req.flash("alertMessage", `${err.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/detail");
        }
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.find();
      const detail = await Detail.findOne({ _id: id }).populate("product");
      res.render("admin/detail/edit", {
        detail,
        product,
        name: req.session.user.name,
        title: "Youpay Admin | Ubah Detail",
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { product, item, description } = req.body;

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
            const detail = await Detail.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${detail.backdrop}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Detail.findOneAndUpdate(
              {
                _id: id,
              },
              {
                product,
                item,
                description,
                backdrop: filename,
              }
            );
            req.flash("alertMessage", "Berhasil Ubah Data");
            req.flash("alertStatus", "success");
            res.redirect("/detail");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/detail");
          }
        });
      } else {
        await Detail.findOneAndUpdate(
          {
            _id: id,
          },
          {
            product,
            item,
            description,
          }
        );
        req.flash("alertMessage", "Berhasil Ubah Data");
        req.flash("alertStatus", "success");
        res.redirect("/detail");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const detail = await Detail.findOneAndRemove({
        _id: id,
      });
      let currentImage = `${config.rootPath}/public/uploads/${detail.backdrop}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      req.flash("alertMessage", "Berhasil Hapus Data");
      req.flash("alertStatus", "success");
      res.redirect("/detail");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
};

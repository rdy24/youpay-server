const Article = require("./model");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };

      const article = await Article.find();

      res.render("admin/article/view_article", {
        article,
        alert,
      });
    } catch (err) {
      console.log(err);
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/article");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/article/create");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/detail");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { judul, body, excrept } = req.body;

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
          const article = new Article({
            judul,
            body,
            excrept,
            image: filename,
          });

          await article.save();
          req.flash("alertMessage", "Berhasil Menambah Data");
          req.flash("alertStatus", "success");
          res.redirect("/article");
        } catch (err) {
          req.flash("alertMessage", `${err.message}`);
          req.flash("alertStatus", "danger");
          res.redirect("/article");
        }
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/article");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const article = await Article.findOne({ _id: id });
      res.render("admin/article/edit", {
        article,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/article");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, body, excrept } = req.body;

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
            const article = await Article.findOne({ _id: id });

            let currentImage = `${config.rootPath}/public/uploads/${article.image}`;
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Article.findOneAndUpdate(
              {
                _id: id,
              },
              {
                judul,
                body,
                excrept,
                image: filename,
              }
            );
            req.flash("alertMessage", "Berhasil Ubah Data");
            req.flash("alertStatus", "success");
            res.redirect("/article");
          } catch (err) {
            req.flash("alertMessage", `${err.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/article");
          }
        });
      } else {
        await Article.findOneAndUpdate(
          {
            _id: id,
          },
          {
            judul,
            body,
            excrept,
          }
        );
        req.flash("alertMessage", "Berhasil Ubah Data");
        req.flash("alertStatus", "success");
        res.redirect("/article");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/article");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const article = await Article.findOneAndRemove({
        _id: id,
      });
      let currentImage = `${config.rootPath}/public/uploads/${article.image}`;
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      req.flash("alertMessage", "Berhasil Hapus Data");
      req.flash("alertStatus", "success");
      res.redirect("/article");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/article");
    }
  },
};

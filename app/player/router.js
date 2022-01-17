var express = require("express");
var router = express.Router();
const {
  landingPage,
  detailPage,
  articlePage,
  articledetailPage,
} = require("./controller");

router.get("/landingpage", landingPage);
router.get("/articlepage", articlePage);
router.get("/:id/detail", detailPage);
router.get("/:id/detail-article", articledetailPage);

module.exports = router;

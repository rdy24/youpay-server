var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
var cors = require("cors");

const usersRouter = require("./app/users/router");
const articleRouter = require("./app/article/router");
const dashboardRouter = require("./app/dashboard/router");
const productRouter = require("./app/product/router");
const detailRouter = require("./app/detail/router");
const playerRouter = require("./app/player/router");
const authRouter = require("./app/auth/router");

const app = express();
const URL = `/api/v1`;
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);
app.use("/trix", express.static(path.join(__dirname, "/node_modules/trix/")));

app.use("/", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/product", productRouter);
app.use("/detail", detailRouter);
app.use("/article", articleRouter);

// api
app.use(`${URL}/players`, playerRouter);
app.use(`${URL}/auth`, authRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

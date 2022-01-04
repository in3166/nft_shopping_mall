var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
console.log(__dirname);
const db = require("./models");
const { throws } = require("assert");
//db.sequelize.sync();

const Role = db.role;
db.sequelize
  .sync()
  .then(() => {
    console.log("DB CONNECTED");
    initial();
  })
  .catch((err) => {
    console.log("DB CONNECTION FAIL");
    console.log("err: ", err);
    // throws(() => new Error("DB connection ERR: \n", err));
  });

app.use("/", indexRouter);
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/images", require("./routes/images"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/banners", require("./routes/banners"));
//app.use('/users', usersRouter);

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
  res.render("[error]: ", err);
});

function initial() {
  Role.findAll({ where: { id: 1 } }).then((res) => {
    if (res?.length === 0) {
      Role.create({
        id: 1,
        name: "user",
      });
    }
  });

  Role.findAll({ where: { id: 2 } }).then((res) => {
    if (res?.length === 0) {
      Role.create({
        id: 2,
        name: "moderator",
      });
    }
  });

  Role.findAll({ where: { id: 3 } }).then((res) => {
    if (res?.length === 0) {
      Role.create({
        id: 3,
        name: "admin",
      });
    }
  });
}

module.exports = app;

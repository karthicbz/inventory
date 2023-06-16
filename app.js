var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Category = require("./models/category");
const ChildCategory = require("./models/child_category");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
// let categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB =
  "mongodb+srv://admin:admin123@cluster0.frh5rdd.mongodb.net/inventory?retryWrites=true&w=majority";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  // await addNewCategory();
  // await addChildCategory();
}

// async function createCategory(name) {
//   const category = new Category({ name: name });
//   await category.save();
//   categories.push(category);
//   console.log("Category added: " + name);
// }

// async function createChildCategory(name, category) {
//   const childCategory = new ChildCategory({ name: name, category: category });
//   await childCategory.save();
//   console.log("child category added: " + name);
// }

// async function addNewCategory() {
//   Promise.all([
//     await createCategory("aluminium"),
//     await createCategory("copper"),
//   ]);
// }

// async function addChildCategory() {
//   if (categories.length > 0) {
//     Promise.all([await createChildCategory("Aluminium Rod", categories[0])]);
//   } else {
//     console.log("Create categories first");
//   }
// }
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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

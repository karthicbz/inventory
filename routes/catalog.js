const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/categoryController");
const childCategoryController = require('../controllers/childCategoryController');

route.get("/", categoryController.home);

route.post("/category/create", categoryController.category_create_post);

route.post("/category/delete", categoryController.category_delete_post);

route.get('/:id', childCategoryController.category_list);

module.exports = route;

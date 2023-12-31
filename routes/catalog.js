const express = require("express");
const route = express.Router();
const categoryController = require("../controllers/categoryController");
const childCategoryController = require("../controllers/childCategoryController");
const childCategoryItemsController = require("../controllers/childCategoryItemsController");

route.get("/", categoryController.home);

route.post("/category/create", categoryController.category_create_post);

route.post("/category/delete/:id", categoryController.category_delete_post);

route.get("/category/update/:id", categoryController.category_update_get);

route.post("/category/update/:id", categoryController.category_update_post);

route.get('/category/:id', childCategoryItemsController.child_category_itemlist_get);

route.post('/category/:id', childCategoryItemsController.child_category_item_create);

route.post('/category/childcategory/delete/:id', childCategoryController.child_category_delete_post);

route.get('/category/childcategory/update/:id', childCategoryController.child_category_update_get);

route.post('/category/childcategory/update/:id', childCategoryController.child_category_update_post);

route.post('/item/update/:id', childCategoryItemsController.child_category_item_update);

route.post('/item/delete/:id', childCategoryItemsController.child_category_item_delete);

route.get('/item/search/', childCategoryItemsController.child_category_items_get);

route.post("/:id", childCategoryController.child_category_create_post);

route.get("/:id", childCategoryController.category_list);

module.exports = route;

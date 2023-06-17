const express = require("express");
const asynchandler = require("express-async-handler");
const Category = require("../models/category");
const {body, validationResult} = require('express-validator');

exports.home = asynchandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("home", {
    categories: allCategories,
    category: "",
    errors: "",
  });
});

exports.category_create_post = asynchandler(async (req, res, next) => {
  const newCategory = new Category({
    name: req.body.categoryname,
  });
  const categoryExists = await Category.findOne({
    name: req.body.categoryname,
  }).exec();
  if (categoryExists) {
    res.redirect(categoryExists.url);
  } else {
    await newCategory.save();
    res.redirect("/inventory");
  }
});

exports.category_delete_get = asynchandler((req, res, next) => {
  res.send("delete not implemented: " + req.params.id);
});

exports.category_delete_post = asynchandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.params.id).exec();
  res.redirect("/inventory");
});

exports.category_update_get = asynchandler(async (req, res, next) => {
  const categoryName = await Category.findById(req.params.id).exec();
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("home", { categories: allCategories, category: categoryName.name, errors:"" });
});

exports.category_update_post = [
  body('categoryname', 'Category name must be minimum 3 character length')
  .trim()
  .isLength({min:3})
  .escape(),

  asynchandler(async (req, res, next) => {
    const errors = validationResult(req);
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    const updatedCategory = new Category({name:req.body.categoryname, _id:req.params.id});

    if(!errors.isEmpty()){
      res.render('home', {categories:allCategories, category:req.body.categoryname, errors:errors.array()});
    }else{
      const categoryExists = await Category.findOne({
        name: req.body.categoryname,
      }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await Category.findByIdAndUpdate(req.params.id, updatedCategory, {});
        res.redirect("/inventory");
      }
    }
  }),
];

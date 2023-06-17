const express = require("express");
const asynchandler = require("express-async-handler");
const ChildCategories = require("../models/child_category");
const Category = require("../models/category");

exports.category_list = asynchandler(async (req, res, next) => {
  const [allCategory, thisCategory, childCategories] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Category.findById(req.params.id).exec(),
    ChildCategories.find({ category: req.params.id }).exec(),
  ]);
  res.render("category_list", {
    title: thisCategory.name,
    childCategories: childCategories,
    categories: allCategory,
    currentCategory: thisCategory,
    error: '',
  });
});

exports.child_category_create_post = asynchandler(async (req, res, next)=>{
  const parentCategory = await Category.findById(req.params.id).exec();
  const newCategory = new ChildCategories({name:req.body.childcategory, category:parentCategory});
  await newCategory.save();
  res.redirect(parentCategory.url);
})

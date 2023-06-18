const express = require("express");
const asynchandler = require("express-async-handler");
const Category = require("../models/category");
const ChildCategory = require('../models/child_category');
const {body, validationResult} = require('express-validator');

function getEmptyCategories(allCategories, allChildCategories){
  let categories = [];
  let emptyCategories = [];
  let found = 0;
  allCategories.forEach(category=>{
    allChildCategories.forEach(childCategory=>{
      if(category._id.toString() === childCategory.category._id.toString()){
        found += 1;
      }
    })
    categories = [...categories, {category:category.name, value: found}];
    found = 0;
  })
  emptyCategories = categories.filter(category=>{
    if(category.value === 0){
      return category;
    }
  })
  // console.log(emptyCategories);
  return emptyCategories;
}

exports.home = asynchandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  const allChildCategories = await ChildCategory.find().populate('category').exec();
  
  // console.log(categories);
  res.render("home", {
    categories: allCategories,
    category: "",
    errors: "",
    emptyCategories: getEmptyCategories(allCategories, allChildCategories),
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
  const childCategories = await ChildCategory.find({category:req.params.id}).exec();
  const thisCategory = await Category.findById(req.params.id).exec();
  const allCategory = await Category.find().sort({name:1}).exec();

  if(childCategories.length > 0){
    res.render('category_list', {
      title:thisCategory.name, 
      childCategories:childCategories, 
      categories:allCategory, 
      currentCategory:thisCategory,
      childCategoryName:'',
      error: 'Delete Child Categories below before attempting to delete Category',
    });
  }else{
  await Category.findByIdAndRemove(req.params.id).exec();
  res.redirect("/inventory");
  }
});

exports.category_update_get = asynchandler(async (req, res, next) => {
  const categoryName = await Category.findById(req.params.id).exec();
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  const allChildCategories = await ChildCategory.find().populate('category').exec();

  res.render("home", { 
    categories: allCategories, 
    category: categoryName.name, 
    errors:"",  
    emptyCategories: getEmptyCategories(allCategories, allChildCategories)
  });
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
    const allChildCategories = await ChildCategory.find().populate('category').exec();


    if(!errors.isEmpty()){
      res.render('home', {
        categories:allCategories, 
        category:req.body.categoryname, 
        errors:errors.array(), 
        emptyCategories: getEmptyCategories(allCategories, allChildCategories)
      });
    }else{
      const categoryExists = await Category.findOne({
        name: req.body.categoryname,
      }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        const updatedValue = await Category.findByIdAndUpdate(req.params.id, updatedCategory, {});
        res.redirect(updatedValue.url);
      }
    }
  }),
];

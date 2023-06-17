const express = require("express");
const asynchandler = require("express-async-handler");
const ChildCategories = require("../models/child_category");
const Items = require("../models/items");
const Category = require("../models/category");
const {body, validationResult} = require('express-validator');

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
    childCategoryName:'',
    error: '',
  });
});

exports.child_category_create_post = asynchandler(async (req, res, next)=>{
  const parentCategory = await Category.findById(req.params.id).exec();
  const newCategory = new ChildCategories({name:req.body.childcategory, category:parentCategory});
  await newCategory.save();
  res.redirect(parentCategory.url);
});

exports.child_category_delete_post = asynchandler(async (req, res, next)=>{
  const childCategory = await ChildCategories.findById(req.params.id).populate('category').exec();
  const itemsFound = await Items.find({childOf:req.params.id}).exec();
  if(itemsFound.length > 0){
    res.render('child_category_list', {
      title:childCategory.name, 
      childCategories:itemsFound, 
      currentCategory:childCategory, 
      error:'Delete items below before attempting to delete Category'
    })
  }else{
    await ChildCategories.findByIdAndRemove(req.params.id);
    res.redirect(childCategory.category.url);
  }
});

exports.child_category_update_get = asynchandler(async (req, res, next)=>{
  const [allCategory, childCategories] = await Promise.all([
    await Category.find().sort({name:1}).exec(),
    await ChildCategories.findById(req.params.id).populate('category').exec(),
  ]);
  const allChildCategories = await ChildCategories.find({category:childCategories.category._id}).exec();
  // console.log(`childCategories: ${childCategories.name}`);
  res.render('category_list', {
    title:childCategories.category.name,
    childCategories: allChildCategories,
    categories: allCategory,
    currentCategory: childCategories.category,
    childCategoryName: childCategories.name,
    error:'',
  })
});

exports.child_category_update_post = [
  body('childcategory', 'Name must be atleast 3 characters length')
  .trim()
  .isLength({min:3})
  .escape(),

  asynchandler(async (req, res, next)=>{
    const errors = validationResult(req);
    console.log(req.body);
    const [allCategory, childCategories] = await Promise.all([
      await Category.find().sort({name:1}).exec(),
      await ChildCategories.findById(req.params.id).populate('category').exec(),
    ]);
    const allChildCategories = await ChildCategories.find({category:childCategories.category._id}).exec();
    const updatedChildCategory = new ChildCategories({
      name:req.body.childcategory,
      category: childCategories.category._id,
      _id:req.params.id,
    })
    if(!errors.isEmpty()){
      res.render('category_list', {
        title:childCategories.category.name,
        childCategories: allChildCategories,
        categories: allCategory,
        currentCategory: childCategories.category,
        childCategoryName: req.body.childcategory,
        error:errors.array(),
      })
    }else{
      const childCategoryExists = await ChildCategories.findOne({name:req.body.childcategory}).exec();
      if(childCategoryExists){
        res.redirect(childCategoryExists.url);
      }else{
        const updatedCategory = await ChildCategories.findByIdAndUpdate(req.params.id, updatedChildCategory, {});
        res.redirect(updatedCategory.url);
      }
    }
  })
];



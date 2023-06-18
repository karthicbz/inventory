const asynchandler = require('express-async-handler');
const Category = require('../models/category');
const ChildCategory = require('../models/child_category');
const Items = require('../models/items');
const {body, validationResult} = require('express-validator');

exports.child_category_itemlist_get = asynchandler(async (req, res, next)=>{
    const childCategory = await ChildCategory.findById(req.params.id).populate('category').exec();
    const items = await Items.find({childOf:req.params.id}).exec();
    const allCategory = await Category.find().exec();

    // res.json(`category: ${category}, childCategory: ${childCategory}`);
    res.render('child_category_list', {
        title: childCategory.name,
        childCategories: items,
        categories: allCategory,
        currentCategory: childCategory,
        error: '',
    });
});

exports.child_category_item_create = asynchandler(async (req, res, next)=>{
    const childCategory = await ChildCategory.findById(req.params.id).exec();
    const item = new Items({
        name: req.body.itemname,
        quantity: req.body.itemquantity,
        price: req.body.itemprice,
        childOf: req.params.id,
    });
    await item.save();
    res.redirect(childCategory.url);
});

exports.child_category_item_update = asynchandler(async (req, res, next)=>{
    const currentItem = await Items.findById(req.params.id).populate('childOf').exec();

    const updateItem = new Items({
        name: req.body.itemname,
        quantity: req.body.itemquantity,
        price: req.body.itemprice,
        childOf: currentItem.childOf._id,
        _id: req.params.id,
    });

    await Items.findByIdAndUpdate(req.params.id, updateItem, {});

    res.redirect(currentItem.childOf.url);
});

exports.child_category_item_delete = asynchandler(async (req, res, next)=>{
    const currentItem = await Items.findById(req.params.id).populate('childOf').exec();

    await Items.findByIdAndRemove(req.params.id);
    res.redirect(currentItem.childOf.url);
});
const asynchandler = require('express-async-handler');
const Category = require('../models/category');
const ChildCategory = require('../models/child_category');
const Items = require('../models/items');

exports.child_category_itemlist_get = asynchandler(async (req, res, next)=>{
    const childCategory = await ChildCategory.findById(req.params.id).exec();
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
})
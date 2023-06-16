const express = require("express");
const asynchandler = require("express-async-handler");
const Category = require("../models/category");

exports.category_list = asynchandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("home", {
    categories:allCategories,
  });
});

exports.category_create_get = asynchandler((req, res, next) => {});

exports.category_create_post = asynchandler((req, res, next) => {});

exports.category_delete_get = asynchandler((req, res, next) => {});

exports.category_delete_post = asynchandler((req, res, next) => {});

exports.category_update_get = asynchandler((req, res, next) => {});

exports.category_update_post = asynchandler((req, res, next) => {});

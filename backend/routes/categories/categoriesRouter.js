const express = require("express");
const {createCategory, getAllCategories, deleteCategory, updateCategory} = require("../../controllers/categories/categoriesController")
const isLoggedIn = require("../../middlewares/isLoggedIn")
const categoriesRouter = express.Router();
//!create Category Router
categoriesRouter.post("/",isLoggedIn,createCategory);

//! Fetch All Categories Route
categoriesRouter.get("/",getAllCategories);

//! update a category Route
categoriesRouter.put("/:id",isLoggedIn,updateCategory)
//! Delete A Category Route
categoriesRouter.delete("/:id",isLoggedIn,deleteCategory)
module.exports = categoriesRouter;
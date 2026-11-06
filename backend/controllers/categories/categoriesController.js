const Category = require("../../models/Categories/Category");
const asyncHandler = require("express-async-handler")//jaha jaha error anay ki sambhawana hogi voha ayega asyncHandler

//@desc Create new Category
//@route POST/api/v1/categories
//@access private
exports.createCategory = asyncHandler(async(req,resp,next) =>{
    const {name} = req.body;
    const isCategoryPresent = await Category.findOne({name});
    if(isCategoryPresent){
        throw new Error("Category already existing")
    }
   const category = await Category.create({name:name,author:req?.userAuth?._id});
   resp.json({
    status:"success",
    message:"Category created succesfully",
    category,
   })
})
//@desc Get all categories
//public acces
//@route GET /api/v1/categories

exports.getAllCategories = asyncHandler(async (req,resp) =>{
   const allCategories = await Category.find({}).populate({
    path:"posts", // field ka nam
    model:"Post",
    
})
   resp.status(201).json({
    status:"success",
    message:"All categories successfully fetched",
    allCategories
   })
});// after making this configure route
// route configure karna hoga ab( Application ko batana ki kis URL par kaunsa code chalna chahiye )

//@desc delete single categories
//@route DELETE /api/v1/categories/:id
//@access private

exports.deleteCategory = asyncHandler(async (req,resp) =>{
   const catId = req.params.id;
   resp.status(201).json({
    status:"success",
    message:"Category successfull deleted"
   }) 
})
//@desc Update single category
//@route PUT  api/v1/categories/:id
//@access private
exports.updateCategory = asyncHandler(async (req,resp) =>{
    const catId = req.params.id;
    const name = req.body.name;
    const updatedCategory = await Category.findByIdAndUpdate(catId,{name:name},{new:true, runValidators:true})
    resp.status(201).json({
        status:"success",
        message:"category successfully updated",
        updatedCategory,
    })
})
//
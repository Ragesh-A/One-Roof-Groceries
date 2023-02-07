const Category = require('../models/categorySchema');
const slugify = require('slugify');
const fs =require('fs')
const path = require('path')


let addCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      child: addCategories(categories, cate._id),
    });
  }
  return categoryList;
};

exports.createCategory = (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: slugify(req.body.name),
      categoryImage: req.file.filename,
      description: req.body.description,
    };

    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }
    const cat = new Category(categoryObj);
    cat.save((err, category) => {
      if (err) res.status(400).json({ err });
      if (category)
      {
        let folderPath = path.join(__dirname, `../../src/public/uploads/product/${category._id}`)
        fs.mkdir(folderPath, (err)=>{
          if(err) return console.log(err);

        })
        res.status(201).redirect('/admin/category/list');
      }      
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    let categoryList = await Category.find({});
    req.categoryList = categoryList;
  } catch (error) {
    console.log(error);
  }
  next();
};

exports.getCategory = async (req, res, next) => {
  try {
    let _category = await Category.findOne({ _id: req.params.id });
    req.category = _category;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    if (req.file) {
      req.body.categoryImage = req.file.filename;
    }
    let data = await Category.updateOne({ _id: req.params.id }, req.body);
    res.redirect('/admin/category/list');
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCategory = async(req, res) => {
  Category.deleteOne({ _id: req.params.id })
    .then(() => res.redirect('/admin/category/list'))
    .catch(err => console.error(err));
};
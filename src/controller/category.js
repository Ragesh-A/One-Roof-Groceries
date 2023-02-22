const Category = require("../models/categorySchema");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

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

const createCategory = (req, res) => {
   try {
      let name = req.body.name.toLowerCase();
      
      const categoryObj = {
         name: name,
         slug: slugify(name),
         categoryImage: req.file.filename,
         description: req.body.description,
      };

      if (req.body.parentId) {
         categoryObj.parentId = req.body.parentId;
      }
      const cat = new Category(categoryObj);
      cat.save((err, category) => {
         if (err){ 
            req.flash('cat-error', "Category Already Exists");
            res.redirect('/admin/category/create');
         }
         if (category) {
            let folderPath = path.join(
               __dirname,
               `../../src/public/uploads/product/${category._id}`
            );
            fs.mkdir(folderPath, (err) => {
               if (err) return console.log(err);
            });
            req.flash('success',"category created successfully")
            res.status(201).redirect("/admin/category/list");
         }
      });
   } catch (error) {
      console.error(error);
   }
};

const getCategories = async (req, res, next) => {
   try {
      let categoryList = await Category.find({});
      req.categoryList = categoryList;
   } catch (error) {
      console.log(error);
   }
   next();
};

const getCategory = async (req, res, next) => {
   try {
      let _category = await Category.findOne({ _id: req.params.id });
      req.category = _category;
      next();
   } catch (error) {
      console.log(error);
   }
};

const updateCategory = async (req, res) => {
   try {
      if (req.file) {
         req.body.categoryImage = req.file.filename;
      }
      let data = await Category.updateOne({ _id: req.params.id }, req.body);
      req.flash('success', "category updated successfully");
      res.redirect("/admin/category/list");
   } catch (error) {
      console.log(error);
      req.flash('up-cate-err', "category already exist")
      res.redirect(`/admin/category/edit/${req.params.id}`)
   }
};

const deleteCategory = async (req, res) => {
   Category.deleteOne({ _id: req.params.id })
      .then(() => {
         req.flash('success', "category deleted successfully");
         res.redirect("/admin/category/list")
      })
      .catch((err) => console.error(err));
};



/*------------------- RENDER PAGE-------------------- */

const renderCategories = (req, res) => {
   res.render("category", { categories: req.categoryList , page: "category" });
}

const adminRenderCategories = (req, res) => {
   res.render("admins/categories", {
      user: req.user,
      page: "category",
      categories: req.categoryList,
      success: req.flash('success')
   });
}

const renderCreateCategory = (req, res) => {
   res.render("admins/addcategory", {
      user: req.user,
      page: "category",
      categoryList: req.categoryList,
      err: req.flash('cat-error')
   });
}
const renderEditCategory = (req, res) => {
   res.render("admins/editCategory", {
      user: req.user,
      page: "category",
      categoryList: req.categoryList,
      category: req.category,
      err: req.flash('up-cate-err')
   });
};

module.exports= {
   renderCategories,
   createCategory,
   getCategories,
   getCategory,
   updateCategory,
   deleteCategory,
   adminRenderCategories,
   renderCreateCategory,
   renderEditCategory,
}
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const profileDestination = path.join(__dirname, '../public/uploads/profiles');
const categoryDestination = path.join(__dirname, '../public/uploads/category');
let productDestination = path.join(__dirname, '../public/uploads/product');
const bannerDestination = path.join(__dirname,'../public/uploads/banner');

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDestination);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${file.originalname}`);
  },
});

const categoryImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryDestination);
  },
  filename: (req, file, cb) => {
    const name = req.body.name.replace(/ /g, '-');
    cb(null, `${name}-${file.originalname}`);
  },
});

const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productPath = path.join(productDestination, req.body.category);
    cb(null, productPath);
  },
  filename: (req, file, cb) => {
    const name = req.body.name.replace(/ /g, '-');
    const fileName = `${name}-${file.originalname}`;
    cb(null, fileName);
  },
});

const poductImageUpadate = multer.diskStorage({
  destination: (req, file, cb) => {
    const productPath = path.join(productDestination, req.body.category);
    cb(null, productPath);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
  },
});

//BANNER STORAGE
const BannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannerDestination);
  },
  filename: (req, file, cb)=>{
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const uploadBanner = multer({storage: BannerStorage})
const uploadProfileImage = multer({ storage: profileImageStorage });
const uploadCategoryImage = multer({ storage: categoryImageStorage });
const uploadProductImage = multer({
  storage: productImageStorage,
  limits: { files: 5 },
});


//PROFILE IMAGE RESIZER
const resizeImage = (req, res, next) => {
  if (!req.file) return next();

  const fileBuffer = fs.readFileSync(req.file.path);

  sharp(fileBuffer)
    .resize(250, 250)
    .jpeg({ quality: 80 })
    .toFile(req.file.path, (err, info) => {
      if (info) {
        next();
      }
      if (err) {
        req.flash('err', 'connot set image: ' + err.message);
        res.redirect('/err');
      }
    });
};

//PRODUCT IMAGE VALISATION AND CROPPING
const resizeProductImage = (req, res, next) => {
  if (!req.files){
    req.flash('err', 'connot set images ');
    res.redirect('/err');
  };

  req.files.forEach(file => {
    let fileBuffer = fs.readFileSync(file.path)
    sharp(fileBuffer)
    .resize(500, 500)
    .toFile(file.path)
  })
  next();
};
//BANNER VALIDATIONS AND CROPPING
const resizebanner = (req, res, next)=>{
  if(req.file == undefined){
    req.flash('err', "image is required")
    return res.redirect('/admin/layouts')
  }
  
  let fileBuffer = fs.readFileSync(req.file.path)
  sharp(fileBuffer)
  .resize(1570, 700)
  .toFile(req.file.path, (err, file)=>{
    if(file) return next()
    if(err){
      req.flash('err', "error while resizing the image")
      res.redirect('/admin/layouts')
    }
  })
}


module.exports = {
  
  uploadProfileImage,
  uploadCategoryImage,
  uploadProductImage,
  uploadBanner,
  resizeImage,
  resizeProductImage,
  resizebanner,
};

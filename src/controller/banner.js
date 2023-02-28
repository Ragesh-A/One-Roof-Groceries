const Banner = require('../models/bannerSchema')

const createBanner = async function(req, res){
  
  try {
    const newBanner = new Banner({
      name: req.body.name,
      action : req.body.action,
      message: req.body.message,
      imageName : req.file.filename
    })
    newBanner.save((err, banner) => {
      if(err){
        req.flash("err", "error file saving banner image");
        return res.redirect('/admin/layouts')
      }
      if(banner){
        req.flash("success", "Banner saved successfully");
        return res.redirect('/admin/layouts')
      }
    })
  } catch (error) {
    req.flash("err", "error file saving banner image");
        return res.redirect('/admin/layouts')
  }
  
}


const getAllBanners = async (req, res, next) => {

  const bannerList = await Banner.find({}).sort({updateAt: -1})
  if(!bannerList) return req.bannerList = [];

  req.bannerList = bannerList;
  next();
}

const getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({_id: req.params.id})
    if(!banner) return res.json({banner: banner})
    res.json({banner})
  } catch (error) {
    res.json({error: error.message})
  }
}

const deleteBanner = async (req, res) => {
  try {
    
    const deleted = await Banner.findOneAndDelete({_id: req.params.id})
    if(!deleted){
      req.flash('err', "failed to delete banner");
      return res.redirect('/admin/layouts')
    }
    req.flash("success", "Banner deleted successfully")
    res.redirect('/admin/layouts')
  } catch (error) {
    req.flash("err", error.message)
    res.redirect('/admin/layouts')
  }
}

const updateBanner = async (req, res)=>{

  try {
    const id = req.params.id
    const data = req.body
    const updated = await Banner.updateOne({_id: id},data)
    if(!updated){
      req.flash('err', "failed to update banner")
      return res.redirect('/admin/layout')
    }
    req.flash('success', "banner updated successfully")
    res.redirect('/admin/layout')
  } catch (error) {
    req.flash('err', error.message)
    res.redirect('/admin/layout')
  }
}

const renderBannerPage = async (req, res)=>{
  res.render('admins/layout', {
    user: req.user,
    page: "lauouts",
    err : req.flash('err'),
    success : req.flash('success'),
    bannerList : req.bannerList 
  })
}

module.exports ={
  createBanner,
  renderBannerPage,
  updateBanner,
  deleteBanner,
  getAllBanners,
  getBanner,
}
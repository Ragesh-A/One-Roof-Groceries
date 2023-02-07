const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

exports.requireSignin = async (req, res, next) => {
    
    if (req.cookies.Authorization) {
        const token = req.cookies.Authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_KEY);

        try {
            User.findOne({_id: user._id}).exec((err, data)=>{
                if(data){
                    if(data.active){
                        req.user = user
                        next()
                    }else{
                        res.render('banned')
                    }
                }
                if(err){
                    res.redirect('/err')
                }
            })
        } catch (error) {
            res.redirect('/err')
        }

    }
    else { res.redirect('account/signin') }
}

exports.adminMiddleware = async (req, res, next) => {
    await getImage(req)
    if (req.user.role != 'admin') return res.status(403).redirect('/account')
    next();
} 

exports.supportMiddleware = async (req, res, next)=>{
    await getImage(req)
    if(req.user.role != 'supportTeam') res.status(403).redirect('/account')
    next()
}
exports.managerMiddleware = async (req, res, next)=>{
    await getImage(req)
    if(req.user.role != 'manager') return  res.status(403).redirect('/account')
    next()
}

async function getImage(req){
let user = await User.findOne({_id: req.user._id},{profilePicture: 1})
req.user.profilePicture = user.profilePicture
}
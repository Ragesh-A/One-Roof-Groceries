const express = require('express');
const { supportMiddleware, requireSignin } = require('../commonMiddleware');
const { getAllUser } = require('../controller/user');
const router = express.Router()

router.get('/', requireSignin,supportMiddleware, (req,res)=>{
    res.render('supportive/index',{user: req.user, page:'dashboard'})
})
router.get('/users', requireSignin,supportMiddleware, getAllUser, (req,res)=>{
    res.render('supportive/users',{user: req.user, page:'users', usersList: req.usersList})
})







module.exports = router;
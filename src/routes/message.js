const express = require('express');
const { requireSignin } = require('../commonMiddleware');
const router = express.Router()

router.get('/',requireSignin,(req,res)=>{
    res.render('contact')
})

module.exports = router;
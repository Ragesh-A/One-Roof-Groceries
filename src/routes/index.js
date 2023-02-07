const express = require('express')
const { requireSignin } = require('../commonMiddleware')
const router = express.Router()

let accountRouter = require('./account')


router.get('/', (req, res) => {

    res.render('index',{user : 'admin'})
})


router.use('/account', accountRouter)



module.exports = router;
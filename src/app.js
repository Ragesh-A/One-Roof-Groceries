const path = require('path');
const env = require('dotenv');
const express = require('express');
const nocache = require('nocache');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const accountRouter = require('./routes/account');
const categoryRouter = require('./routes/category');
const messageRouter = require('./routes/message');
const managerRouter = require('./routes/manager');
const supportRouter = require('./routes/support');
const productRouter = require('./routes/product');
const wishlistRouter = require('./routes/wishlist');
const otpRouter = require('./routes/test');
const apiRouter = require('./routes/api');
const cartRouter = require('./routes/cart');
const searchRouter = require('./routes/search');
const { getAllProducts, latestProducts } = require('./controller/product');

mongoose.set('strictQuery', true);

const app = express();
env.config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'))
app.use(nocache());
app.use(flash());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(
  session({
    secret: 'key',
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 },
  })
);

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/otp', otpRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);
app.use('/account', accountRouter);
app.use('/product', productRouter);
app.use('/contact', messageRouter);
app.use('/manager', managerRouter);
app.use('/support', supportRouter);
app.use('/category', categoryRouter);
app.use('/wishlist', wishlistRouter);
app.use('/search', searchRouter);

app.get('/t', getAllProducts, (req, res) => {
  res.render('product', { products: req.products });
});

app.get('*', (req, res) => res.render('redirection'));

module.exports = app;

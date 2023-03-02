const path = require('path');
const env = require('dotenv');
const express = require('express');
const nocache = require('nocache');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

env.config();
let PORT = process.env.PORT || 3000;
const DB = process.env.NEW_DATABASE_URL;

//DATABASE CALL
mongoose.set('strictQuery', true);
connectDataBase()

const indexRouter = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
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
app.get('*', (req, res) => res.render('404'));

//DTABASE CONNECTION CODE
function connectDataBase(){
  mongoose
  .connect(process.env.NEW_DATABASE_URL)
  .then(() => {
    console.log("Atlas is connnected");
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`)
    });
  })
  .catch((err)=>{
    console.log(err);
    connectDataBase()
  });
}


module.exports = app;

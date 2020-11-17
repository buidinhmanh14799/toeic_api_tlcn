
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

var voacaRouter = require('./routes/vocaRouter');
var userRouter = require('./routes/userRouter');
var adminRouter = require('./routes/adminRouter');

const dotenv = require('dotenv')

// dotenv.config()
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect(process.env.mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then( function(){
  console.log("connected")
}).catch((err)=>{
  console.log("error"+err)
})

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(expressValidator())

//login
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
      mongooseConnection: db
  })
}));


app.use('/voca', voacaRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);









// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

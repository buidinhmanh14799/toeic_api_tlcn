
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

var voacaRouter = require('./routes/vocaRouter');
var userRouter = require('./routes/userRouter');
var adminRouter = require('./routes/adminRouter');
var sendcode = require('./routes/sendcodeRouter');
var googleRouter = require('./routes/googleRouter');

const dotenv = require('dotenv')
// var expressSession = require('express-session');
var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// dotenv.config()
const mongoose = require('mongoose');
const db = mongoose.connection;
console.log(process.env.mongoDB);
mongoose.connect(process.env.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(function () {
  console.log("connected")
}).catch((err) => {
  console.log("error" + err)
})

var app = express();



// view engine setup

//Cấu hình express-session.
// app.use(expressSession({secret: 'keyboard cat'}))
//Cấu hình Passport.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cors())

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
app.use('/send', sendcode);
app.use('/google', googleRouter);

app.use((req, res, next)=> {
  console.log('vao dau yyyyyyyyyyyyyyyyyyyyyyy');
  let token = req.headers.authorization;
  if (!token) {
    token = req.headers.cookie?.split('=')[1];
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token',
        });
      }
      req.accepted = decoded;
      next();
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided',
    });
  }
});

console.log(process.env.JWT_SECRET_KEY)

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: [keys.cookieKey]
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());










// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;

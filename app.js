var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
var passport = require('passport');
require('./authenticate');


const usersRouter = require('./routes/users');
const articleRouter = require('./routes/articleRouter');

// connect database Mongo
const url = config.mongoUrl;
const connect = mongoose.connect(process.env.MONGODB_URI || url);

connect.then((db) => {
  console.log("Connected to server")
}, (err) => { console.log(err) });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/api/users', usersRouter);
app.use('/api/articles', articleRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

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

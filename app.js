var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var monk = require('monk');
var db = monk('mongodb+srv://suraj:suraj@cluster0.b7pwh.mongodb.net/mydb?retryWrites=true&w=majority');
db.then(() =>{
  console.log("connection success");
}).catch((e)=>{
  console.error("Error !",e);
});
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
 });
app.use('/', indexRouter);

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

const PORT = process.env.PORT ||5000;

const listener = app.listen(PORT,()=>{
 console.log("Project running on port " + PORT)
});


module.exports = app

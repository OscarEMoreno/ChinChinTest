var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config()

//Router list
var myRouter = require("./routes/myRoutes");
/**************/

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());

//Solve any CORS problems in the future
app.use((req, res, next) => {
    
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers","Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
  res.header("Accesss-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET, HEAD, OPTIONS");
  res.header('Allow', 'PUT,POST,PATCH,DELETE,GET,HEAD,OPTIONS');
  if (req.method === "OPTIONS") {
    res.header("Accesss-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET, HEAD,OPTIONS");
    return res.status(200).json({});
  }
  next();
});
//

//Routes list
app.use("/ChinChin", myRouter); 
/**************/

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//

module.exports = app;

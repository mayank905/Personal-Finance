const express=require('express');
const app=express();

const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const cors=require('cors');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());  
const originRegExp = /^.*$/;  
app.use(cors({
    origin: originRegExp,
    credentials: true
  }));

// Middleware function to set the response header
const setAccessControlHeader = function(req, res, next) {
  console.log('response set');
  // res.header("Access-Control-Allow-Origin", 'http://127.0.0.1:5500');
  next();
};

// Routes
app.use('/api', setAccessControlHeader, require('./routes/api'));
app.use('/', setAccessControlHeader, require('./routes/auth'));


var port=parseInt(process.env.SERVER_PORT);
app.listen(port);
console.log('Order API is running at ' + port); 





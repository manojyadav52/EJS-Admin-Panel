// require('./env').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const router = require('./Auth/router/userRouter');
const path = require('path');
const app = express();
const PORT =8080;
const cookiePareser = require('cookie-parser');

app.use(express.urlencoded({extended:true}));
app.use(express.json());


// user cookieParser 
app.use(cookiePareser());
// connect the  database mongoose 
mongoose.connect('mongodb://localhost:27017/ejs-backend1',
{useNewUrlParser: true, useUnifiedTopology:true});

// ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './Auth/views'));

app.use('/api',router);


app.listen(PORT, (req,res)=>console.log(`Server will be listening on ${PORT}`))

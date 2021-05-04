const express = require('express');
const app = express();
require("./db/connectDB");

const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const checkAuth = require('./middlewares/check-auth');
const { googleLogin } = require('./controllers/google-auth');
const authRoutes = require("./router/auth");


mongoose.connect('mongodb://127.0.0.1/blindsbeta', { //also in .env
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;


app.use(express.json());
// used to log everything, GET, POST, etc requests
app.use(morgan('dev'));
app.use(cors());
// true allows simple bodies for urlencoded data, false only allows simple bodies
app.use(bodyParser.urlencoded({ extended: false }));
// extract json data in readble form
app.use(bodyParser.json());

// to make upload folder publically available via route /api/videos 
app.use('/api/videos', express.static('media/uploads'));
app.use('/api/googlelogin', googleLogin)

// middlewares
app.use('/api', authRoutes);

// routes
app.use('/api/signUp', require('./router/signUp'));
app.use('/api/signIn', require('./router/signIn'));
app.use('/api/upload', checkAuth, require('./router/upload'));
app.use('/api/videoList', checkAuth, require('./router/videoList'));

module.exports = app;
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 3000;

const mongoose = require('mongoose');
if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    const mongodbAtlasUri = 'mongodb+srv://admin:admin@cluster0-jv6hi.mongodb.net/CustomerRelation?retryWrites=true&w=majority';
    mongoose.connect(mongodbAtlasUri, (err) => {
        if (err) throw new Error(err);
        console.log("Connected successfully");
    });
} else {
    mongoose.connect('mongodb://localhost:27017/CustomerRelation');
}

const api = require('./server/routes/API');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'ejs');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '/dist/resturant-application')));
}

app.use('/resources', express.static(path.join(__dirname, 'server/public')));

app.use('/api', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

module.exports = app;

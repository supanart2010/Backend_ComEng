const express = require('express');
const initServer = require('./configs/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

passport.use(
    new LocalStrategy((username, password, cb) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }

            if (bcrypt.compareSync(password, user.password)) {
                return cb(null, user);
            }
            return cb(null, false);
        });
    })
);
passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});



initServer();
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my_super_secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
app.use('/', indexRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (req, res) => {
    console.log(`Server Started at PORT ${PORT}`);
});
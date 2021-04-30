//import lib
const express = require('express');
const initServer = require('./configs/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// import routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const topicRouter = require('./routes/topic');

// ใช้ LocalStrategy โดยใช้ username และ password
// ภายใน function จะใช้ User.findOne() เพื่อหา username ใน Database
// ถ้าเจอ ก็ compareSync ด้วย bcrypt หากตรง แสดงว่า login ถูกต้อง
// ก็จะ cb (คือ callback function) ส่งต่อไปให้ `req.user` จะมีค่า user
// และไป step ถัดไปคือ serialzie และ deserialize
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('incorrect username');
                return done(null, false, { message: 'Incorrect username' });
            }

            if (bcrypt.compareSync(password, user.password)) {
                console.log(user.username + ' is login');
                return done(null, user);
            }
            console.log('incorrect password');
            return done(null, false, { message: 'Incorrect password.' });
        });
    })
);
// serializeUser และ seserialize จะใช้ร่วมกับ session เพื่อจะดึงค่า user ระหว่าง http request
// โดย serializeUser จะเก็บ ค่าไว้ที่ session
// ในที่นี้คือ cb(null, user._id_) - ค่า _id จะถูกเก็บใน session
// ส่วน derialize ใช้กรณีที่จะดึงค่าจาก session มาหาใน DB ว่าใช่ user จริงๆมั้ย
// โดยจะเห็นได้ว่า ต้องเอา username มา `User.findById()` ถ้าเจอ ก็ cb(null, user)
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

//connect db + start server
const PORT = process.env.PORT || 4000;
initServer().then(result => {
    app.listen(PORT, (req, res) => {
        console.log(`Server Started at PORT ${PORT}`);
    });
});

var app = express();

//set viewengine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/topics', topicRouter);

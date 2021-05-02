const express = require('express');
const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user.username + ' session login');
        next();
    } else {
        res.redirect('/login');
    }
};


router.get('/', isLoggedIn, function(req, res, next) {
    //console.log(req.user);
    //res.render('index', { title: 'Express', user: req.user });
    //var string = encodeURIComponent(req.user._id);
    //res.redirect('/topics?userID=' + string);
    //res.redirect('/topics');
});

router.get('/register', (req, res) => {
    res.render('register', { message: "" });
});

router.get('/login', (req, res) => {
    res.render('login', { message: "" });
});

router.get('/logout', (req, res) => {
    console.log('user ' + req.user.username + ' logout successful');
    req.logout();
    res.redirect('/');
});

module.exports = router;
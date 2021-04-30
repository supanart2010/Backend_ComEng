const express = require('express');
const Topic = require('../models/topic');
const Comment = require('../models/comment');

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user.username + ' session login');
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', isLoggedIn, (req,res) => {
  var currentUserID = req.user._id;
  Topic.find()
   .then((topics) => {
       Comment.find()
         .then(comments => {
          console.log(req.user);
           res.render('topics', {topics, comments});
         })
   })
   .catch((err) => {
       console.log(err);
   });
});

router.get('/add', isLoggedIn, (req,res) => {
   const topic = new Topic({
       body: "topic3",
       author: req.user._id
   });

   topic.save()
       .then((result) => {
        res.redirect('/topics')
       })
       .catch((err) => {
           console.log(err);
       });
});

router.get('/add-cm', isLoggedIn, (req,res) => {
   Topic.findOne({body:"topic1"}).then(result => {
       const comment = new Comment({
           body: "comment1",
           author: req.user._id,
           topic: result._id
       });
       comment.save()
           .then((result) => {
              res.redirect('/topics');
              console.log("here");
           })
           .catch((err) => {
               console.log(err);
           });
   });
});

router.get('/cm', (req,res) => {
   Comment.findOne({body:"comment1"})
       .populate('topic')
       .exec((err,comment) => {
           if(err) console.log(err);
           console.log(comment.topic.body);
           res.send(comment);
       })
});

module.exports = router;
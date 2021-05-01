const express = require('express');
const mongoose = require('mongoose');
const Topic = require('../models/topic');
const Comment = require('../models/comment');
const User = require('../models/User');
const Test = require('../models/test');

const router = express.Router();

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.user.username + ' session login');
        next();
    } else {
        res.redirect('/login');
    }
};

/** return all topics, each topic with 1 latest comment.
 *  return topics are ordered by descending date 
 */ 
router.get('/', async (req,res) => {
    var response = {};
    const topics = await Topic.find()
        .select('-__v -updatedAt')
        .sort({ createdAt: -1 })
        .populate('author', 'username')
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    const topicAndComment = await Promise.all(topics.map(async (tp) => {
        const comment = await Comment.findOne({ topic: tp._id })
        .select('-__v -updatedAt')
        .sort({ createdAt: -1 })
        .populate('author', 'username')
        .exec()
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
        return {
            _id: tp._id,
            topicBody: tp.body,
            topicAuthor: tp.author,
            topicLikes: tp.likes,
            topicCreatedAt: tp.createdAt,
            comment: comment,
            request: {
                type: 'GET',
                url: 'http://localhost:4000/topics/' + tp._id
            }
        };
    }));
    res.status(200).json({
        topicCount: topics.length,
        topics: topicAndComment
    });
});

// add new topic **expects body in req.body**
router.post('/', isLoggedIn, (req, res) => {
    const newTopic = new Topic({
        body: req.body.body,
        author: req.user._id,
    });
    newTopic.save()
        .then(result => {
            res.status(201).json({
                message: "Created new topic succesfully",
                topic: {
                    body: newTopic.body,
                    author: newTopic.author,
                    likes: newTopic.likes,
                    createdAt: newTopic.createdAt,
                    _id: newTopic._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:4000/topics/' + newTopic._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error saving topic to database",
                error: err
            });
        });
});

/** get all comment of a single topic
 *  return all comment ordered by ascending date (ก่อนไปหลัง)
 */
router.get('/:id', (req,res) => {
    const topicID = req.params.id;
    Topic.findById(topicID) //invalid id will throws error. valid but absent id will return null
        .populate('author', 'username')
        .select('-__v -updatedAt')
        .exec()
        .then(topic => {
            if(topic) {
                Comment.find({topic: topicID}) //if fails will return []
                .populate('author', 'username')
                .select('-__v -updatedAt -topic')
                .then(comments=>{
                        res.status(200).json({
                            topic, comments
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err});
                })
            }
            else{
                res.status(404).json({message: 'No topic found for provided ID'});
            }
        })
        .catch(err => {;
            console.log(err);
            res.status(500).json({
                message: "Error finding the requested topic",
                error: err,
            });
        });
});


//edit topic **expects ARRAY of {propName: value} in req.body**
router.patch('/:topicId', (req,res,next) => {
    const id = req.params.topicId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Topic.updateOne({ _id: id }, { $set : updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Topic edited',
            request: {
                type: 'GET',
                url: 'http://localhost:4000/topics/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//delete topic from db
router.delete('/:topicId', (req,res,next) => {
    const id = req.params.topicId;
    Topic.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err).json({
                error: err
            });
        });
});


// manual add to database;
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

router.get('/add-cm', (req,res) => {
   Topic.findOne({body:"topic3"})
   .then(result => {
       const comment = new Comment({
           body: "comment123",
           author: '608af474dcfabe1280ce50dd',
           topic: result._id
       });
       comment.save()
           .then((result) => {
              res.status(201).json(result);
           })
           .catch((err) => {
               console.log(err);
           });
   });
});

module.exports = router;
const express = require('express');
const Topic = require('../models/topic');
const Comment = require('../models/comment');

const router = express.Router();

// add new comment, **expects body, topicId in req.body**
router.post('/',(req,res,next) => {
    const id = req.body.topicId;
    Topic.findById(id)
        .then(topic => {
            if(!topic) {
                return res.status(404).json({
                    message: 'Topic not Found'
                });
            }
            const newComment = new Comment({
                body: req.body.body,
                topic: req.body.topicId,
                author: req.user._id,
            });
            return newComment.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Comment created",
                comment: newComment,
                request: {
                    type: 'GET',
                    url: "http://localhost:4000/topics/" + id
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

//edit comment **expects newBody in req.body**
router.patch('/:commentId',(req,res,next) => {
    const id = req.params.commentId;
    Comment.findByIdAndUpdate(id, { $set: { body: req.body.newBody } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Comment edited',
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/topics/' + id
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//didnt check user permission
router.delete('/:commentId',(req,res,next) => {
    const id = req.params.commentId;
    Comment.findByIdAndDelete(id)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Comment deleted',
                request: {
                    type: 'GET',
                    url: 'localhost:4000/topics/'
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

module.exports = router;

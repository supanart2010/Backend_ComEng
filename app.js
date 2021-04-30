const express = require('express');
const mongoose = require('mongoose');
const Topic = require('./models/topic');
const Comment = require('./models/comment');

const app = express();

const dbURI = 'mongodb+srv://Tarm:Tarm123@cluster0.0a1dx.mongodb.net/ComEngEss?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true}) //async function
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.get('/', (req,res) => {
   Topic.find()
    .then((topics) => {
        Comment.find()
          .then(comments => {
            res.render('index', {topics, comments});
          })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/add', (req,res) => {
    const topic = new Topic({
        body: "topic3",
        author: 'mine'
    });

    topic.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/add-cm', (req,res) => {
    Topic.findOne({body:"topic1"}).then(result => {
        const comment = new Comment({
            body: "comment1",
            author: "a",
            topic: result._id
        });
        comment.save()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

app.get('/cm', (req,res) => {
    Comment.findOne({body:"comment1"})
        .populate('topic')
        .exec((err,comment) => {
            if(err) console.log(err);
            console.log(comment.topic.body);
            res.send(comment);
        })
});
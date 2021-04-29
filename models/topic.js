const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String, //to be changed to "Schema.Types.ObjectId, ref: 'User'"
    required: true,
  },
  //comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: Number,
}, {timestamps: true});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
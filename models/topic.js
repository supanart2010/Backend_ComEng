const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId, ref: 'User', 
    required: true,
  },
  //comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: {
    type: Number,
    default: 0,
  }
}, { timestamps: true});

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
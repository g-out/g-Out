const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required']
  },
  user: { type: mongoose.Types.ObjectId, ref: 'User' }, 
  comment: String,
  place: { type: mongoose.Types.ObjectId, ref: 'Place' }
}, {timestamps: true})  

const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;
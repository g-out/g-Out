const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', },
  place: { type: mongoose.Types.ObjectId, ref: 'Place', },
  comments: {
    type: String
  },
  title: {
    type: String
  }
}, { timestamps: true })


const Value = mongoose.model('Valuations', valueSchema);
module.exports = Value;

const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  stars: {
    type: Number,
    // buscar max y minimo numero
    trim: true
  },
  userID: {
    type: String,
    required: [true, 'User is required']
  },
  placeID: {
    type: String,
    required: [true, 'Place is required']
  },
  comments: {
    type: String
  }
}, { timestamps: true })


const Value = mongoose.model('Valuations', valueSchema);
module.exports = Value;

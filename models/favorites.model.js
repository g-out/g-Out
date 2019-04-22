const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({  
  userID: {
    type: String,
    required: [true, 'User is required']
  },
  placeID: {
    type: String,
    required: [true, 'Place is required']
  }
}, { timestamps: true })


const Fav = mongoose.model('Favorites', favSchema);
module.exports = Fav;

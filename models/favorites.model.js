const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({  
  user: { type: mongoose.Types.ObjectId, ref: 'User', },
  place: { type: mongoose.Types.ObjectId, ref: 'Place', },
}, { timestamps: true })


const Fav = mongoose.model('Favorites', favSchema);
module.exports = Fav;

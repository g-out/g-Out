const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 8 chars'],
    trim: true
  },
  address: {
    type: {Type: String},
    coordinates: [Number]
  },
  phone: {
    type: Number,
    required: [true, 'Phone is required'],
    minlength: [9, 'Phone needs at last 9 chars'],
    maxlength: [9, 'Phone needs 9 chars']
  },
  userID: {
    type: String
  },
  category: [
    {
      food: {
        type: [String],
        num: ["Asiatica", "Española", "Italiana", "Moderna"],
        required: [true, 'Name is required']
      },
      music: {
        type: [String],
        num: ["techno", "house", "pop", "salsa", "rock", "reggaeton", "funky"],
        required: [true, 'Name is required']
      },
    }
  ],
  localType: {
    type: String,
    required: [true, 'Name is required'],
    num: ["pub", "restaurant", "disco", "bar", "coffee"]
  } 
}, { timestamps: true })

placeSchema.index({ location: '2dsphere' });

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;

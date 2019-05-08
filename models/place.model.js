const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 8 chars'],
    trim: true
  },
  addressMap: {
    type: {Type: String},
    location: [Number]
  },
  address: String,
  phone: {
    type: Number,
    required: [true, 'Phone is required'],
    minlength: [9, 'Phone needs at last 9 chars'],
    maxlength: [9, 'Phone needs 9 chars']
  },
  userEmail: {
    type: String,
    required: [true, 'Email is required']
  },
  userID: {
    type: String,
    required: [true, 'UserID is required']
  },
  shortDescription: {
    type: String,
    default: ''
  },
  LongDescription: {
    type: String,
    default: ''
  },
  imageThumbs: {
    type: String,
    required: [true, 'image is required'],
    default: '/img/coffe.jpeg'
  },
  images: [String],
  category: {
      food: {
        type: String,
        num: process.env.FOOD_TYPE,
        required: [true, 'Food type is required']
      },
      music: {
        type: String,
        num: process.env.MUSIC_TYPE,
        required: [true, 'Music type is required']
      },
  },
  localType: {
    type: String,
    required: [true, 'Local type is required'],
    num: process.env.PLACE_TYPE
  } 
}, { timestamps: true })

placeSchema.index({ location: '2dsphere' });

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;

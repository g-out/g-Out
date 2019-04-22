const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  commensals: {
    type: Number,
    // buscar max y minimo numero
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
  },
  date: {
    type: Date,
    // mirar si falta algun parametro

    required: [true, 'Date is required']
  }
}, { timestamps: true })


const Booking = mongoose.model('Bookings', bookingSchema);
module.exports = Booking;

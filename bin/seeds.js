// archivo de creacion de base de datos
const axios = require('axios');
const Places = require('../models/place.model');
const Valuations = require('../models/valuations.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');
require('../config/db.config');
const what = 'Restaurant'
const lugares = ['Restaurant', 'coffee', 'bar']

// Ayudar al pobre de Josué
// lugares.map(lugar => {
//   getLocations(lugar);
// })
// Conectas axios
// Make a request for a user with a given ID
function getLocations(what) {
  axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
  params: {
    query:`${what}+in+madrid`,
    key:'AIzaSyC6ZCMc68-WlyzGtqkjraw3nroaEYqcIww'
  }
})
  .then(function (response) {
    // handle success
    console.log(response.data);

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });

}

// tratas el response (axios)

// import mongo 


// Places.create(movies)
//   .then((movies) => console.info(`${movies.length} new movies added to the database`))
//   .catch(error => console.error(error))
//   .then(() => mongoose.connection.close());
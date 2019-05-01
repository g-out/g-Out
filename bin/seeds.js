// archivo de creacion de base de datos
const axios = require('axios');
const User = require('../models/user.model');
const Places = require('../models/place.model');
const Valuations = require('../models/valuations.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');
require('../config/db.config');
const places2 = ['Restaurant', 'cafe', 'bar', 'night_club'];

const users = [];
const places = []

function createUsers() {
  for(i=0; i<40; i++) {//noooo
    let user = new User({
      user: `user${i}`,
      email: `user${i}@example.org`,
      password: '12345678'
    })
    users.push(user)
  }
} 

// Ayudar al pobre de Josué
// lugares.map(lugar => {
//   getLocations(lugar);
// })location=40.425530, -3.703252&radius=10000&type=cafe&key=AIzaSyC6ZCMc68-WlyzGtqkjraw3nroaEYqcIww
// Conectas axios
// Make a request for a user with a given ID

axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
  params: {
    location:"40.425530, -3.703252",
    radius:"10000",
    type:"cafe",
    key:"AIzaSyC6ZCMc68-WlyzGtqkjraw3nroaEYqcIww"
  }
})
  .then(function (response) {
    console.log('ya estamos buscando')
    setTimeout(()=> {axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        pagetoken: response.data.next_page_token,
        key:"AIzaSyC6ZCMc68-WlyzGtqkjraw3nroaEYqcIww"
       }
    })
      .then(function(response){
        return places.push(response.data.results)
      //  return console.log(response.data.results)
      })}, 1500)
    // handle success
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function(response){
     // logica de parseo y añadir a la BBDD
  })

console.log(places)
// tratas el response (axios)

// import mongo 


// Places.create(movies)
//   .then((movies) => console.info(`${movies.length} new movies added to the database`))
//   .catch(error => console.error(error))
//   .then(() => mongoose.connection.close());
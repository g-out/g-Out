// archivo de creacion de base de datos

const constants = require('../constants')

const axios = require('axios');
const User = require('../models/user.model');
const Places = require('../models/place.model');
const Valuations = require('../models/valuations.model');
const Booking = require('../models/booking.model');
const mongoose = require('mongoose');
require('../config/db.config');

const musicsType = constants.MUSIC_TYPE
const foodsType = constants.FOOD_TYPE
const placesType = constants.PLACE_TYPE

const usersEmail = []

function createUsers() {
  let users = [];
  for(i=0; i<40; i++) {//noooo
    let user = new User({
      name: `user${i}`,
      email: `user${i}@example.org`,
      password: '12345678'
    })
    usersEmail.push(user.email)
    users.push(user)
  }
  return users
} 

function elementAleatory(myArray) {
  return myArray[Math.floor(Math.random()*myArray.length)]
}

User.create(createUsers(40))
  .then((users) => console.info(`${users.length} new users added to the database`))
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close());
  

function createPlaces(datas) {
  let places = []
  datas.map((data) => {
    let place = new Places({
      name: data.name ,
      address: data.vicinity,
      phone: 955000111,
      userEmail: elementAleatory(usersEmail),
      category: {
        food: elementAleatory(foodsType),
        music: elementAleatory(musicsType),
      },
      localType: elementAleatory(placesType),
    })
    places.push(place)
  })
  console.log(places)
  Places.create(places)
  .then((places) => {
    console.info(`${places.length} new places added to the database`)})
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close());
}


function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
} 
for (i=0; i <= placesType.length; i++) {
  let results = []
  axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
    params: {
      location: "40.425530, -3.703252",
      radius: "10000",
      type: placesType[i],
      key: constants.GOOGLE_API_KEY
    }
  })
    .then(sleeper(1500))
    .then((response) => {
      axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          pagetoken: response.data.next_page_token,
          key: constants.GOOGLE_API_KEY
        }
      })
        .then(sleeper(1500))
        .then((response) => {
          axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
            params: {
              pagetoken: response.data.next_page_token,
              key: constants.GOOGLE_API_KEY
            }
          })
            .then(sleeper(1500))
            .then((response) => { return results = [...response.data.results]/* createPlaces(response, placesType[i]) */ })
          return results = [...response.data.results]//createPlaces(response, placesType[i])
        })
        results = [...response.data.results]
        createPlaces(results) 
         /* createPlaces(response, placesType[i]) */
    })
    .catch(function (error) {
      console.log(error);
    })
}

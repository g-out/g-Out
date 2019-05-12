// archivo de creacion de base de datos

require('dotenv').config();
const constants = require('../constants')

const location=  "40.3833013, -3.6724749"

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id ligula quis ipsum bibendum laoreet id ut mauris. Duis sollicitudin ac enim eget faucibus. Vestibulum at lacus eu dolor condimentum fermentum. Curabitur suscipit turpis et odio blandit dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque rhoncus justo ac sem viverra, nec dignissim nunc lobortis. Ut imperdiet quis ligula eu iaculis. Praesent interdum leo sit amet ultricies semper.'
const NUM_COMMENTS_MAX = 10
const NUM_USERS_CREATE = 40
const NUM_FAVORITES_MAX = 100
const QUERY_GOOGLE_URI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
const QUERY_GOOGLE_DATA = {
  location: location,
  radius: "10000",
  key: process.env.GOOGLE_API_KEY
};


const axios = require('axios');
const User = require('../models/user.model');
const Places = require('../models/place.model');
const Comments = require('../models/comments.model');
const Favorites = require('../models/favorites.model')
const mongoose = require('mongoose');
require('../config/db.config');

const musicsType = constants.MUSIC_TYPE
const foodsType = constants.FOOD_TYPE
const placesType = constants.PLACE_TYPE

let users = []; 
let places = []

function createUsers() {
  for(i=0; i<40; i++) {
    let user = new User({
      name: `user${i}`,
      email: `user${i}@example.org`,
      password: '12345678'
    })
    users = [...users, user]
  }
  return users
} 

function elementAleatory(myArray) {
  return myArray[Math.floor(Math.random()*myArray.length)]
}

User.create(createUsers(40))
  .then((users) => console.info(`${users.length} new users added to the database`))
  .catch(error => console.error(error))
  

function createPlaces(datas, type) {
  (datas.filter(data => data.name != undefined)).forEach((data) => {
    let place = new Places({
      name: data.name,
      location : {
        lat: data.geometry.location.lat,
        lng: data.geometry.location.lng
      },
      iconType: data.icon,
      address: data.vicinity,
      phone: 955000111,
      userEmail: elementAleatory(users.map(user=> user.email)),
      userID:  elementAleatory(users.map(user=> user._id)),
      shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' ,
      LongDescription: LOREM_IPSUM,
      category: {
        food: elementAleatory(foodsType),
        music: elementAleatory(musicsType),
      },
      localType: type,
    })
    places = [...places, place]
  })
  console.log(places)
  Places.create(places)
  .then((places) => {console.info(`${places.length} new places added to the database`)
    // Comments.create(createComments(NUM_COMMENTS_MAX))
    //   .then((comments) => console.info(`${NUM_COMMENTS_MAX} new comments added to the database`))
    //   .catch(error => console.error(error))
    // Favorites.create(createFavorites(NUM_FAVORITES_MAX))
    //   .then((favorites) => console.info(`${NUM_FAVORITES_MAX} new comments added to the database`))
    //   .catch(error => console.error(error))
  })
  .catch(error => console.error(error))
  .then(() => mongoose.connection.close());
}

function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
} 

function nextPage(data) {
  let params = {
    pagetoken: data.next_page_token,
    key: process.env.GOOGLE_API_KEY
  }
  return axios.get(QUERY_GOOGLE_URI, {params: params})
}


placesType.forEach((type) => {
  let results = []
  axios.get(QUERY_GOOGLE_URI, {params: {...QUERY_GOOGLE_DATA, type: type}})
    .then(sleeper(4000))
    .then((response) => {
      nextPage(response.data)
        .then(sleeper(4000))
        .then((response) => {
          nextPage(response.data)
            .then(sleeper(4000))
            .then((response) => {
              results = [...results, ...response.data.results]
              return createPlaces(results, type)
            })
          results = [...results, ...response.data.results]
        })
      results = [results, ...response.data.results]
    })
    .catch(function (error) {
      console.log(error);
    })
})

function createComments(maxComments, places) {
  return places.map(place =>{
    for (i=0; i>=Math.floor(Math.random()*maxComments) ; i++) {
      return {
        title: 'title',
        user:  elementAleatory(users.map(user=> user._id)),
        place: elementAleatory(place[i]._id),
        comment: LOREM_IPSUM,
      }
    }
  })
} 



function createFavorites(maxFavorites, places) {
  return places.map(place =>{
    for (i=0; i>=Math.floor(Math.random()*maxFavorites) ; i++) {
      return {
        user:  elementAleatory(users.map(user=> user._id)),
        place: elementAleatory(place[i]._id),
      }
    }
  })
}



/* 

function sleep(delay) {
  return (x) => new Promise((resolve, reject) =>
    setTimeout(() => resolve(x), delay)
  )
}

sleep(1500)('Carlos')
  .then(name => console.log(name));


module.exports.isAdmin = (res, res, next) => {
  if (req.user.role === 'admin') {
    next()
  } else {
    next(createError(403))
  }
}


module.exports.checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next()
    } else {
      next(createError(403))
    }
  }
}


router.get('/users', isAdmin, users.list)
router.get('/users', checkRole('admin'), users.list) */
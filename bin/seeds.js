// archivo de creacion de base de datos

require('dotenv').config();
const constants = require('../constants')


const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id ligula quis ipsum bibendum laoreet id ut mauris. Duis sollicitudin ac enim eget faucibus. Vestibulum at lacus eu dolor condimentum fermentum. Curabitur suscipit turpis et odio blandit dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque rhoncus justo ac sem viverra, nec dignissim nunc lobortis. Ut imperdiet quis ligula eu iaculis. Praesent interdum leo sit amet ultricies semper.'
const NUM_USERS_CREATE = 40
const QUERY_GOOGLE_URI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
const QUERY_GOOGLE_DATA = {
  location: "40.425530, -3.703252",
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

const users = createUsers(NUM_USERS_CREATE); 
let places = [];

queryGoogle()

function createDB() {
  User.create(users)
    .then((users) => console.info(`${users.length} new users added to the database`))
    .catch(error => console.error(error + ' error1'))
  Places.create(places)
    .then((places) => { console.info(`${places.length} new places added to the database`) })
    .catch(error => console.error(error + 'error2'))
  Comments.create(createComments())
    .then((comments) => console.info(`${comments.length} new comments added to the database`))
    .catch(error => console.error(error + ' error3'))
  Favorites.create(createFavorites())
    .then((favorites) => console.info(`${favorites.length} new favorites added to the database`))
    .catch(error => console.error(error))
  //.then(() => mongoose.connection.close());
}


function createUsers() {
  let arrUser = []
  for (i = 0; i < 40; i++) {
    let user = new User({
      name: `user${i}`,
      email: `user${i}@example.org`,
      password: '12345678'
    })
    arrUser = [...arrUser, user]
  }
  return arrUser
}

function elementAleatory(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)]
}


function createPlaces(datas, type) {
  (datas.filter(data => data.name != undefined)).forEach((data) => {
    switch (type) {
      case "bar":
        data.image = '/img/vino.jpg'
        break;
      case "night_club":
        data.image = '/img/cocktail.jpg'
        break;
      case "cafe":
        data.image = '/img/cafe.jpg'
        break;
      case "Restaurant":
        data.image = '/img/restaurante.jpg'
        break;
    }
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
      imageThumbs: data.image
    })
    places = [...places, place]
    if (places.length >= placesType.length * 60) createDB()
  })
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


function queryGoogle() {
  placesType.forEach((type) => {
    let results = []
    axios.get(QUERY_GOOGLE_URI, { params: { ...QUERY_GOOGLE_DATA, type: type } })
      .then(sleeper(2500))
      .then((response) => {
        nextPage(response.data)
          .then(sleeper(2500))
          .then((response) => {
            nextPage(response.data)
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
}

function createComments() {
  let newComments = []
  places.map(place => {
    users.forEach(user => {
      if (Math.floor(Math.random() * 2) % 2 == 0) {
        newComments = [...newComments, {
          title: 'Title comment of user: ' + user.name,
          user: user._id,
          place: place._id,
          comment: LOREM_IPSUM,
        }]
      }
    })
  })
  return newComments
}


function createFavorites() {
  let newFavorites = []
  places.forEach(place => {
    users.forEach(user => {
      if (Math.floor(Math.random() * 5) % 5 == 0) {
        newFavorites = [...newFavorites, {
          user: user._id,
          place: place._id,
          comment: LOREM_IPSUM,
        }]
      }
    })
  })
  return newFavorites
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
// archivo de creacion de base de datos

require('dotenv').config();
const constants = require('../constants')


const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id ligula quis ipsum bibendum laoreet id ut mauris. Duis sollicitudin ac enim eget faucibus. Vestibulum at lacus eu dolor condimentum fermentum. Curabitur suscipit turpis et odio blandit dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque rhoncus justo ac sem viverra, nec dignissim nunc lobortis. Ut imperdiet quis ligula eu iaculis. Praesent interdum leo sit amet ultricies semper.'
const NUM_COMMENTS_MAX = 5
const NUM_USERS_CREATE = 40
const NUM_FAVORITES_MAX = 100
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

var arrUsers = []; 

function elementAleatory(myArray) {
  return myArray[Math.floor(Math.random()*myArray.length)]
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

function createUsers(n) {
  for(i=0; i<=n; i++) {
    let user = new User({
      name: `user${i}`,
      email: `user${i}@example.org`,
      password: '12345678',
      likes: {
        food: elementAleatory(foodsType),
        music: elementAleatory(musicsType),
      }
    })
    arrUsers = [...arrUsers, user]
  }
  return arrUsers
} 

function createPlaces(datas, type) {
  let arrPlaces = datas.map((data) => {
    if(data.name == undefined){data.name = 'Los Torreznos'};
    return new Places({
      name: data.name,
      address: data.vicinity,
      phone: 955000111,
      userEmail: elementAleatory(arrUsers.map(user=> user.email)),
      userID:  elementAleatory(arrUsers.map(user=> user._id)),
      shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' ,
      LongDescription: LOREM_IPSUM,
      category: {
        food: elementAleatory(foodsType),
        music: elementAleatory(musicsType),
      },
      localType: type,
    })
  })
  createComments(NUM_COMMENTS_MAX, arrPlaces)
}


function queryGoogle() {
  createUsers(NUM_USERS_CREATE)
  placesType.forEach((type) => {
    let arrPlacesGoogle = []
    axios.get(QUERY_GOOGLE_URI, { params: { ...QUERY_GOOGLE_DATA, type: type } })
      .then(sleeper(1500))
      .then((response) => {
        nextPage(response.data)
          .then(sleeper(1500))
          .then((response) => {
            nextPage(response.data)
              .then((response) => {
                arrPlacesGoogle = [...arrPlacesGoogle, ...response.data.results]
                createPlaces(arrPlacesGoogle)
              })
            arrPlacesGoogle = [...arrPlacesGoogle, ...response.data.results]
          })
        arrPlacesGoogle = [arrPlacesGoogle, ...response.data.results]
      })
      .catch(error => console.error(error))
  })
}


function createComments(maxComments, places) {
  let arrComments = places.map(place =>{
    let arrCommentsPlace = []
    let numRamdon = Math.floor(Math.random()*NUM_COMMENTS_MAX)
    for (i=1; i>= numRamdon; i++) {
      let comment = new Comments({
        title: 'title',
        user:  elementAleatory(arrUsers.map(user=> user._id)),
        place: place._id,
        comment: LOREM_IPSUM,
      })
      arrCommentsPlace = [...arrCommentsPlace, comment]
    } 
    return arrCommentsPlace
  })

  console.log(arrCommentsPlace.length)
  /* 
  console.log(arrComments.length)
  Comments.create(arrComments)
    .then((comment) => console.info(`${comment.length} new users added to the database`))
    .catch(error => console.error(error)) */
} 

queryGoogle()


"geometry": {
  "location": sfasd,
  "viewport": asdf
},
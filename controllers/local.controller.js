const mongoose = require('mongoose')
const Local = require('./../models/place.model')
const constants = require('../constants')
const FOOD_TYPE = constants.FOOD_TYPE
const MUSIC_TYPE = constants.MUSIC_TYPE
const PLACE_TYPE = constants.PLACE_TYPE

module.exports.list = (req, res, next) => {
    res.render('locals/list');
}
module.exports.create = (req, res, next) => {
    res.render('locals/form', {
        foods: FOOD_TYPE,
        musics: MUSIC_TYPE,
        places: PLACE_TYPE
    });
}
module.exports.doCreate = (req, res, next) => {
    console.log(req.body)
    const newLocal = new Local({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        category: {
            food: req.body.food,
            music: req.body.music,
        }, 
        localType: req.body.localType
    });

    newLocal.save()
        .then(()=>{
            res.redirect('/local')
        })
        .catch(error => { // errrores de validacion
            // console.log(error)
            if(error instanceof mongoose.Error.ValidationError){
                res.render('locals/form')
            } else {
                next(error)
            }
        })
}

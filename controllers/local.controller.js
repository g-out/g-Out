const mongoose = require('mongoose')
const Local = require('./../models/place.model')
const constants = require('../constants')
const FOOD_TYPE = constants.FOOD_TYPE
const MUSIC_TYPE = constants.MUSIC_TYPE
const PLACE_TYPE = constants.PLACE_TYPE

module.exports.list = (req, res, next) => {
    Local.find()
    .then((arrLocal) => {
        res.render('locals/list', {
            arrLocales: arrLocal
        });
    })
    .catch(next)
}
module.exports.create = (req, res, next) => {
    res.render('locals/form', {
        foods: FOOD_TYPE,
        musics: MUSIC_TYPE,
        places: PLACE_TYPE
    })
}
module.exports.doCreate = (req, res, next) => {
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
        .then((local)=>{
            res.redirect('/local')
            console.log(local)
        })
        .catch(error => { // errrores de validacion
            if(error instanceof mongoose.Error.ValidationError){
                res.render('locals/form',  {
                    foods: FOOD_TYPE,
                    musics: MUSIC_TYPE,
                    places: PLACE_TYPE
                })
            } else {
                next(error)
            }
        })
}
module.exports.delete = (req, res, next) => {
    const id = req.params.id;

    Local.findByIdAndDelete(id)
    .then((local)=>{
        if(local){
            res.redirect('/local')
        }else{
            next(createError(404, 'Place not found'))
        }
    })
    .catch(next)
}


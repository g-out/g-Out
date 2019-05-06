const mongoose = require('mongoose')
const Local = require('./../models/place.model')
const constants = require('../constants')
const FOOD_TYPE = constants.FOOD_TYPE
const MUSIC_TYPE = constants.MUSIC_TYPE
const PLACE_TYPE = constants.PLACE_TYPE

module.exports.list = (req, res, next) => {
    const id = req.params.id;
    Local.find()
    .then((arrLocal) => {
        res.render('locals/list', {
            arrLocales: arrLocal
        });
    })
    .catch(next)
}

module.exports.details = (req, res, next) => {
    const id = req.params.id;

    Local.findById(id)
    .then(local=>{
        if(local){
            res.render('locals/details', {
                local
            })
        } else {
            next(error)
        }
    })
    .catch(error => next(error));
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

module.exports.edit = (req, res, next) => {
    const id = req.params.id;

    Local.findById(id)
    .then(local=>{
        if(local){
            res.render('locals/form', {
                foods: FOOD_TYPE,
                musics: MUSIC_TYPE,
                places: PLACE_TYPE,
                local
            })
        } else {
            next(error)
        }
    })
    .catch(error => next(error));
}

module.exports.doEdit = (req, res, next) => {
    const id = req.params.id;

    Local.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
    .then ((local) => {
        if(local){
            res.redirect(`/local/${local._id}`)
        } else {
            next(createError(404, 'Local not found'))
        }
    })
    .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          const local = new Local({ ...req.body, _id: id })
          local.isNew = false
  
          res.render('locals/form', {
            foods: FOOD_TYPE,
                musics: MUSIC_TYPE,
                places: PLACE_TYPE,
                local,
            ...error
          })
        } else {
          next(error);
        }
      })
}

module.exports.doLike = (req, res, next) => {
    const id = req.params.id;

  setTimeout(() => {
    Local.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
      .then((local) => res.json({
        localId: local._id,
        likes: local.likes
      }))
      .catch(next)
  }, 3000)
}


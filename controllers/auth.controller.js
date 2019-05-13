const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const passport = require('passport')


module.exports.home = (req, res, next) => {

  const criteria = {};

  if (req.query.search) {
    criteria.name = new RegExp(req.query.search, 'i');
  }

  Place.find(criteria)
    .populate('favorites')
    .then(places => {
      let userLogID = ''
      if (res.locals.session) { userLogID = res.locals.session._id }
      const mapboxPlaces = places.sort(p => Math.random() - 0.5).map(place => {
        return {
          "type": place.localType,
          "geometry": {
            "type": "Point",
            "coordinates": [place.location.lng, place.location.lat]
          },
          "properties": {
            "name": place.name,
            "phone": place.phone,
            "address": place.address,
            "description": place.shortDescription,
            "image": place.imageThumbs,
            "category": place.category,
            "placeID": place._id,
            "favorites": place.favorites,
            "userLoginID": userLogID
          }
        }
      });

      const mapboxData = {
        "type": "FeatureCollection",
        "features": mapboxPlaces
      }
      res.render('auth/home', { places, mapboxData: JSON.stringify(mapboxData) })
    })
    .catch(next)

}

module.exports.register = (req, res, next) => {
  res.render('auth/form')
}

module.exports.doRegister = (req, res, next) => {
  
  function renderWithErrors(errors) {
    res.render('auth/form', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
  .then(user => {
    if (user) {
      renderWithErrors({ email: 'Email already registered' })
    } else {
      user = new User(req.body);
      return user.save()
      .then(user => res.redirect('/login'))
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      renderWithErrors(error.errors)
    } else {
      next(error);
    }
  })
};

module.exports.login = (req, res, next) => {
  res.render('auth/login')
}

module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validation) => {
    if(error) {
      next(error);
    } else if (!user) {
      res.render('auth/login', {
        user: req.body,
        errors: validation
      })
    } else {
      return req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/');
        }
      })
    }
  })(req, res, next)
}

module.exports.loginWithGoogleCallback = (req, res, next) => {
  passport.authenticate(`google-auth`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/');
        }
      })
    }
  })(req, res, next);
}
module.exports.loginWithSpotifyCallback = (req, res, next) => {
  passport.authenticate(`spotify`, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/');
        }
      })
    }
  })(req, res, next);
}

module.exports.profile = (req, res, next) => {
  res.render('auth/profile')
}

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  })
}

module.exports.doProfile = (req, res, next) => {
  if (!req.body.password) {
    delete req.body.password;
  }

  if (req.file) {
    req.body.avatarURL = req.file.secure_url;
  }

  const user = req.user;
  Object.assign(user, req.body);
  user.save()
    .then(user => res.redirect('/profile'))
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('/profile', {
          user: req.body,
          errors: error.errors
        })
      } else {
        next(error);
      }
    });
}

const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport')


module.exports.home = (req, res, next) => {
  res.render('auth/home')
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
          console.log(user)
          res.redirect('/');
        }
      })
    }
  })(req, res, next);
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}

/*
module.exports.profile = (req, res, next) => {
  res.render('auth/profile')
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
        res.render('auth/profile', {
          user: req.body,
          errors: error.errors
        })
      } else {
        next(error);
      }
    });
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}
 */
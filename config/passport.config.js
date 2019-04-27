const User = require('../models/user.model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;


passport.serializeUser((user, next) => {
  next(null, user.id);
})

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => next(null, user))
    .catch(next)
})

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        next(null, null, { password: 'Invalid email or password' })
      } else {
        return user.checkPassword(password)
          .then(match => {
            if (!match) {
              next(null, null, { password: 'Invalid email or password' })
            } else {
              next(null, user);
            }
          })
      }
    })
}));

passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/authenticate/google/cb'
}, (accessToken, refreshToken, profile, next) => {
  const googleId = profile.id;
  const name = profile.displayName;
  const email = profile.emails ? profile.emails[0].value : undefined;
  const avatarURL = profile.picture;
  User.findOne({
    $or: [
      { email: email },
      { 'social.googleId': googleId }
    ]
  })
    .then(user => {
      if (user) {
        next(null, user);
      } else if (!user) {
        user = new User({
          name: name,
          email: email,
          password: Math.random().toString(35), // Be carefully only for dev purposes, Math.random seed is predictable!!
          social: {
            googleId: googleId
          },
          avatarURL: avatarURL
        })
        return user.save()
          .then(user => next(null, user))
      }
    })
    .catch(error => next(error))
})); 


passport.use('spotify', new SpotifyStrategy({
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_SPOTIFY_CALLBACK_URL || '/auth/spotify/callback'
    }, (accessToken, refreshToken, expires_in, profile, next) => {
      console.log(profile)
      const spotifyId = profile.id;
      const name = profile.displayName;
      const email = profile.emails ? profile.emails[0].value : undefined;
      const avatarURL = profile.photos[0];
      User.findOne({
        $or: [
          { email: email },
          { 'social.spotifyId': spotifyId }
        ]
      })
        .then(user => {
          if (user) {
            next(null, user);
          } else if (!user) {
            user = new User({
              name: name,
              email: email,
              password: Math.random().toString(35), // Be carefully only for dev purposes, Math.random seed is predictable!!
              social: {
                spotifyId: spotifyId
              },
              avatarURL: avatarURL
            })
            return user.save()
              .then(user => next(null, user))
          }
        })
        .catch(error => next(error))
    }
  )
);
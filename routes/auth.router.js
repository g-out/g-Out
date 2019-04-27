 const express = require('express');
 const router = express.Router();
 const passport = require('passport');
 const auth = require('../controllers/auth.controller');


 router.get('/', auth.home);
 router.get('/register', auth.register);
 router.post('/register', auth.doRegister)
 router.get('/login', auth.login);
 router.post('/login', auth.doLogin);
 router.post('/logout', auth.logout);
 router.get('/authenticate/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }))
 router.get('/authenticate/google/cb', auth.loginWithGoogleCallback)
 router.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private']}))
 router.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login'}), auth.loginWithSpotifyCallback)


 module.exports = router;
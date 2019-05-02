 const express = require('express');
 const router = express.Router();
 const passport = require('passport');
 const auth = require('../controllers/auth.controller');
 const secure = require('../middlewares/secure.mid');


 router.get('/', auth.home);
 router.get('/register', auth.register);
 router.post('/register', auth.doRegister)
 router.get('/login', auth.login);
 router.post('/login', auth.doLogin);
 router.get('/logout', auth.logout);
 router.get('/profile', secure.isAuthenticated, auth.profile);
 router.get('/authenticate/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }))
 router.get('/authenticate/google/cb', auth.loginWithGoogleCallback)
 router.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private']}))
 router.get('/auth/spotify/callback', auth.loginWithSpotifyCallback);


 module.exports = router;
/* const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const secure = require('../middlewares/secure.mid');
const passport = require('passport');
const storage = require('../config/storage.config');

router.get('/register', auth.register);
router.post('/register', auth.doRegister);
router.get('/login', auth.login);
router.post('/login', auth.doLogin);
router.get('/logout', auth.logout);
router.get('/profile', secure.isAuthenticated, auth.profile);
router.post('/profile', secure.isAuthenticated, storage.single('avatar'), auth.doProfile);
router.get('/authenticate/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }))
router.get('/authenticate/google/cb', auth.loginWithGoogleCallback)

module.exports = router;
 */

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

 module.exports = router;
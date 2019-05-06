const express = require('express');
const router = express.Router();
const local = require('../controllers/local.controller');
const secure = require('../middlewares/secure.mid');


router.get('/', secure.isAuthenticated, local.list);
router.get('/create', secure.isAuthenticated, local.create);
router.post('/', secure.isAuthenticated, local.doCreate);
router.get('/:id/delete', secure.isAuthenticated, local.delete);
router.get('/:id/edit', secure.isAuthenticated, local.edit);
router.post('/:id/like', secure.isAuthenticated, local.doLike);
router.post('/:id', secure.isAuthenticated, local.doEdit);
router.get('/:id', secure.isAuthenticated, local.details);



module.exports = router;
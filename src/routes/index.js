const { Router } = require('express');
const router = Router();
const routerAuth = require('./auth')
const characterRouter = require('./character')
const moviesRouter = require('./movie')
const genderRouter = require('./gender')

router.use('/characters', characterRouter)
router.use('/movies', moviesRouter)
router.use('/gender', genderRouter)
router.use('/auth', routerAuth)

module.exports = router;





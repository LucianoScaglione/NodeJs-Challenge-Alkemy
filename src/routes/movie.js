const { Router } = require('express');
const router = Router();
const Movies = require('../controller/Movies')
const verifyToken = require('../routes/token')

router.get('/', verifyToken, Movies.allMovies)
router.get('/:id', verifyToken, Movies.detailMovie)
router.post('/', verifyToken, Movies.createMovie)
router.put('/:id', verifyToken, Movies.updateMovie)
router.delete('/:id', verifyToken, Movies.deleteMovie)

module.exports = router
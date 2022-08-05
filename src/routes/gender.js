const { Router } = require('express');
const router = Router();
const Gender = require('../controller/Gender')
const verifyToken = require('../routes/token')

router.get('/', verifyToken, Gender.allGender)
router.post('/', verifyToken, Gender.createGender)
router.delete('/:id', verifyToken, Gender.deleteGender)

module.exports = router
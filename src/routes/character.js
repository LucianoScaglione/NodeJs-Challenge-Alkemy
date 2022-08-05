const { Router } = require('express');
const router = Router();
const Characters = require('../controller/Characters')
const verifyToken = require('../routes/token')

router.get('/', verifyToken, Characters.allCharacters)
router.get('/:id', verifyToken, Characters.detailCharacter)
router.post('/', verifyToken, Characters.createCharacter)
router.put('/:id', verifyToken, Characters.updateCharacter)
router.delete('/:id', verifyToken, Characters.deleteCharacter)

module.exports = router



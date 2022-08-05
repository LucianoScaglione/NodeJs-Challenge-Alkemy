const { Router } = require('express');
const router = Router();
const Authentication = require('../controller/Authentication')

router.post('/register', Authentication.userRegister)
router.post('/login', Authentication.userLogin)

module.exports = router
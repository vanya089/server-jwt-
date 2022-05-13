const Router = require('express');
const router = new Router();
const controller = require('./authController')
const {check} = require('express-validator')

router.post('/registration',[
    check('username', "username cannot be empty").notEmpty(),
    check('password', 'password must contain at least 8').isLength({min:8})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)
router.put('/users', controller.rename)
router.delete('/users', controller.delete) 

module.exports = router;
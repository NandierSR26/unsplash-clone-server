const { Router } = require('express');
const { check } = require('express-validator');
const { register, login, revalidateToken } = require('../controllers/auth.controller');
const validateFields = require('../middlewares/validate-fields');
const { validateJwt } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/login', [
    // check('email')
    //     .isEmail().withMessage('The E-mail is not valid')
    //     .notEmpty().withMessage('The E-mail is required'),

    // check('password').notEmpty().withMessage('The password is required'),
    validateFields
], login);

router.post('/register', [
    check('first_name').notEmpty().withMessage('the first_name is required'),
    check('last_name').notEmpty().withMessage('the last_name is required'),
    check('email')
        .isEmail().withMessage('the E-mail is not valid')
        .notEmpty().withMessage('the E-mail is required'),
    check('username').notEmpty().withMessage('the username is required'),
    check('password').notEmpty().withMessage('the password is required'),
    validateFields
], register);

router.get('/renew', validateJwt, revalidateToken)

module.exports = router;
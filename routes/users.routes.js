const { Router } = require('express');
const { check } = require('express-validator');
const { updateUser, deleteCharacter, getUsers, getUser } = require('../controllers/users.controller');
const validateFields = require('../middlewares/validate-fields');
const { validateJwt } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', getUsers);

router.get('/:username', getUser);

router.put('/update/:id', [
    validateJwt,
    check('id', 'The ID is not valid').isMongoId(),
    validateFields
], updateUser);

router.delete('/delete/:id', [
    validateJwt,
    check('id', 'The ID is not valid').isMongoId(),
    validateFields
], deleteCharacter);

module.exports = router;
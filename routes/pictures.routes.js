const { Router } = require('express');
const { check } = require('express-validator');
const { uploadPictures, getPictures, deletePicture, getPicturesByUser, buscar, downloadPicture } = require('../controllers/pictures.controller');
const validateFields = require('../middlewares/validate-fields');
const { validateJwt } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', getPictures )

router.get('/:username', getPicturesByUser)

router.get('/search/:q', buscar);

router.get('/download/:id', downloadPicture)

router.post('/upload', [
    validateJwt,
    check('title').notEmpty().withMessage("the picture's title is required"),
    validateFields
], uploadPictures);

router.delete('/delete/:pictureID', validateJwt, deletePicture );

module.exports = router;
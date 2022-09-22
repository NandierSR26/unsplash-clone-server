const { response } = require("express");
const { uploadFile } = require("../helpers/upload-files");
const Pictures = require("../models/Pictures");
const { awsDeleteImage, awsDownloadImage } = require("../utils/awsManageFiles");
const fs = require('fs')
const shortid = require('shortid')

const getPictures = async (req, res = response) => {

    try {
        const pictures = await Pictures.find().populate({ path: 'user', select: ['username', 'avatar'] });

        return res.status(200).send({
            ok: true,
            pictures
        })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            ok: false,
            msg: 'something went wrong'
        })
    }

}

const getPicturesByUser = async(req, res = response) => {
    const { username } = req.params
    
    const pictures = await Pictures.find().populate({ path: 'user', select: ['username', 'avatar'] })

    const picturesByUser = pictures.filter( picture => picture.user.username === username )
    
    return res.status(200).send({
        ok: true,
        picturesByUser
    })
}

const uploadPictures = async (req, res = response) => {
    let { title } = req.body;
    const { id } = req.user;

    title = `${title}-${ shortid.generate() }`
    const picture = new Pictures(req.body)

    if (req.files) {
        const { tempFilePath, mimetype, name } = req.files.picture;
        const image = await uploadFile('pictures', mimetype, title, tempFilePath, id);
        picture.image = image;
        picture.filename = name;
        picture.mimetype = mimetype
    } else {
        return res.status(400).send({
            ok: false,
            msg: 'You must upload a picture'
        })
    }

    picture.title = title
    picture.user = id;
    await picture.save()

    return res.status(200).send({
        ok: true,
        msg: 'picture uploaded sucessfully',
        picture
    })
}

const deletePicture = async(req, res = response) => {
    const { pictureID } = req.params;
    const { id:uid } = req.user;

    const picture = await Pictures.findById(pictureID);
    if( !picture ){
        return res.status(400).send({
            ok: false,
            msg: 'this picture is not exist'
        });
    }

    if( uid !== picture.user.toString() ) {
        return res.status(401).send({
            ok: false,
            msg: 'you not authorized for delete this picture'
        });
    }

    const mimetype = picture.mimetype.split('/')[1];
    const key = `pictures/${ uid }/${ picture.title }.${ mimetype }`
   
    const result = awsDeleteImage(key);
    await Pictures.findByIdAndDelete(pictureID);

    return res.status(200).send({
        ok: true,
        msg: 'The picture was deleted sucessfully'
    });
    
}

const buscar = async( req, res = response ) => {
    const { q } = req.params

    const regex = new RegExp( q, 'i' );

    const pictures = await Pictures.find({ title: regex }).populate({ path: 'user', select: ['username', 'avatar'] })

    return res.status(200).send({
        ok: true,
        pictures
    })
}

const downloadPicture = async( req, res = response ) => {
    const { id } = req.params;

    const picture = await Pictures.findById(id);
    const mimetype = picture.mimetype.split('/')[1];
    const uid = picture.user.toString()
    const key = `pictures/${ uid }/${ picture.title }.${ mimetype }`

    const result = await awsDownloadImage( key )
    fs.writeFile( `/Users/ASUS/Downloads/${picture.title}.${mimetype}`, result.Body, "binary", ( err ) => {
        if(err) throw err
        return res.status(200).send({
            ok: true,
            msg: 'Picture Downloaded'
        })
    })
}

module.exports = {
    uploadPictures,
    getPictures,
    deletePicture,
    getPicturesByUser,
    buscar,
    downloadPicture
}
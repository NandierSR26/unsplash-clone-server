const { response } = require("express");
const Users = require("../models/Users");
const bcryptjs = require('bcryptjs');
const { generateJwt } = require("../helpers/generate-jwt");
const { uploadFile } = require("../helpers/upload-files");

const register = async (req, res = response) => {
    const {  username, email, password } = req.body;

    try {

        let user = await Users.findOne({ $or: [{ email }, { username }] })

        if (user) {
            return res.status(400).send({
                ok: false,
                msg: 'already exists a user with this email or username'
            })
        }

        user = new Users(req.body);

        const salt = bcryptjs.genSaltSync(10);
        user.password = bcryptjs.hashSync(password, salt);

        if (req.files) {
            const { mimetype, tempFilePath } = req.files.avatar;
            const avatar = await uploadFile('avatar', mimetype, user.id, tempFilePath);
            user.avatar = avatar;
        }

        await user.save();

        res.status(200).send({
            ok: true,
            user
        })

    } catch (error) {
        return res.status(400).send({
            ok: false,
            msg: 'something went wrong'
        })
    }

}

const login = async (req, res = response) => {
    const { email, password } = req.body

    // find email in database
    const user = await Users.findOne({ email })
    if (!user) {
        return res.status(400).send({
            ok: false,
            msg: 'wast not found a user with this E-mail'
        })
    }

    // verify password
    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword) {
        return res.status(401).send({
            ok: false,
            msg: 'Wrong password'
        })
    }

    // the user exists and correct password, authenticate
    const token = await generateJwt(user.id, user.first_name, user.last_name, user.username, user.email, user.avatar);

    return res.status(200).send({
        ok: true,
        token,
        user  
    })

}

const revalidateToken = async(req, res = response) => {

    const { id } = req.user;

    const token = await generateJwt(id);

    return res.status(200).send({
        ok: true,
        token,
        user: req.user
    })
}


module.exports = {
    login,
    register, 
    revalidateToken
}
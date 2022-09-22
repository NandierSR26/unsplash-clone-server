const { response } = require("express");
const { uploadFile, updateAvatar } = require("../helpers/upload-files");
const Users = require("../models/Users");


const getUsers = async(req, res = response) => {
    const users = await Users.find();
    return res.status(200).send({
        ok: true,
        users
    })
}

const getUser = async(req, res = response) => {
    const { username } = req.params
    const user = await Users.findOne({ username });

    if(!user){
        return res.status(400).send({
            ok: false,
            msg: 'there is no user with that ID'
        })
    }

    return res.status(200).send({
        ok: true,
        user
    })
}

const updateUser = async (req, res = response) => {
    const { username, email } = req.body
    const { id } = req.params;
    const { id: uid } = req.user

    const existEmailOrUsername = await Users.findOne({ $or: [{ email }, { username }] })
    if(existEmailOrUsername && existEmailOrUsername.id !== id) {
        return res.status(400).send({
            ok: false,
            msg: 'This E-mail or Username already exist'
        })
    }

    const user = await Users.findById(id);
    if (!user) {
        return res.status(400).send({
            ok: false,
            msg: 'The user was not found'
        })
    }

    if (uid !== user.id.toString()) {
        return res.status(401).send({
            ok: false,
            msg: 'you not authorized for realize this action'
        })
    }

    try {
        const user = await Users.findByIdAndUpdate({ _id: id }, req.body, { new: true })

        if (req.files) {
            const { mimetype, tempFilePath } = req.files.avatar;
            const avatar = await updateAvatar('Avatars', mimetype, user.id, tempFilePath);
            user.avatar = avatar;
        }

        await user.save();

        res.status(200).send({
            ok: true,
            msg: 'Profile updated successfully',
            user
        })
    } catch (error) {
        return res.status(400).send({
            ok: false,
            msg: 'something went wrong'
        })
    }


}
const deleteCharacter = async (req, res = response) => {
    const { id } = req.params;
    const { id: uid } = req.user

    const user = await Users.findById(id);
    if (!user) {
        return res.status(400).send({
            ok: false,
            msg: 'The user was not found'
        })
    }

    if (uid !== user.id.toString()) {
        return res.status(401).send({
            ok: false,
            msg: 'you not authorized for realize this action'
        })
    }

    try {
        const user = await Users.findByIdAndDelete(id);
        res.status(200).send({
            ok: true,
            msg: 'Profile deleted successfully',
            user
        })
    } catch (error) {
        return res.status(400).send({
            ok: false,
            msg: 'something went wrong'
        })
    }
}

module.exports = {
    updateUser,
    deleteCharacter,
    getUsers,
    getUser
}
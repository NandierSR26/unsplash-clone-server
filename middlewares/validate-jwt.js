const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const validateJwt = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'not authorized'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY )

        const user = await Users.findById(uid);

        if( !user ){
            return res.status(401).json({
                msg: 'User not Found'
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Invalid token'
        })
    }
}

module.exports = {
    validateJwt
}
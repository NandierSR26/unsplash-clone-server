const mongoose = require('mongoose');

const dbConecction = async() => {
    try {
        await mongoose.connect( process.env.MONGODB_CNN );
        console.log('db online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar base de datos')
    }
}

module.exports = {
    dbConecction
}
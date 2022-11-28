// const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { s3Client } = require('../libs/sampleClient')
const AWS = require('aws-sdk');
const fs = require('fs')

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
})


const awsUploadImage = async (file, filePath) => {

    const stream = fs.createReadStream(file)

    const params = {
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: stream
    };

    const data = await s3.upload(params).promise();
    return data;


    /* OTRA FORMA DE SUBIR ARCHIVOS AL BUCKET */
    // const comand = new PutObjectCommand( params )
    // const data = await s3Client.send( comand );
    // console.log(data);

}

// const awsReadFile = async( file ) => {
//     const comand = new GetObjectCommand({
//         Bucket: BUCKET_NAME,
//         Key: `pictures/${file}`
//     })

//     const result = await s3Client.send(comand);
//     console.log(result.Body.hos);
//     return result
// }

const awsDeleteImage = async (filePath) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: filePath,
    };


    await s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            return data;
        }
    }).promise();

}

const awsDownloadImage = async (key) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key
    }

    try {
        const data = await s3.getObject( params ).promise()
        return data
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    awsUploadImage,
    awsDeleteImage,
    awsDownloadImage
}
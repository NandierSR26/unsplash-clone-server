const { S3Client } = require("@aws-sdk/client-s3");

const REGION = process.env.AWS_REGION;
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: ID,
        secretAccessKey: SECRET
    }
});
module.exports = { s3Client };
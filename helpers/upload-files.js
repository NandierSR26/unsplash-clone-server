const { awsUploadImage, awsReadFile } = require("../utils/awsManageFiles");


const uploadFile = async( collection, mimetype = '', name, file, user ) => {
    const extension = mimetype.split('/')[1]
    const filePath = `${collection}/${ user }/${name}.${extension}`;

    const { Location } = await awsUploadImage( file, filePath );
    return Location
}

const updateAvatar = async( collection, mimetype = '', name, file ) => {
    const extension = mimetype.split('/')[1]
    const filePath = `${collection}/${name}.${extension}`;

    const { Location } = await awsUploadImage( file, filePath );
    return Location
}

module.exports = {
    uploadFile,
    updateAvatar
}

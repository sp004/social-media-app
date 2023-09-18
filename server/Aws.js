import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
// import S3 from 'aws-sdk/clients/s3';
// import fromIni from 'aws-sdk/credential-provider-ini';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'meetchat',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, file.originalname + Date.now())
      }
    })
  })
  
export default upload

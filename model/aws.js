var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;

const s3 = new AWS.S3();



async function uploadFile(fileContent, fileName) {
      const params = {
            Bucket: "graffitiproject",
            Key: fileName,
            Body: fileContent,
            ACL: "public-read"
      };

      const result = await new Promise((resolve) => {
            s3.upload(params, (err, data) => {
                  if (err) {
                        console.error(err);
                  }
                  resolve(data.Location);
            });
      });
      return {
            key: fileName,
            link: result
      };
}


function deleteFile(key) {
      console.log(key);
      const params = {
            Bucket: "graffitiproject",
            Key: key
      };
      s3.deleteObject(params, (err) => {
            if (err) {
                  console.error(err);
            }
      });



}


module.exports = { uploadFile, deleteFile };



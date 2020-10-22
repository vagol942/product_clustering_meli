const AWS = require("aws-sdk");

class S3Client {
  constructor(accessKeyId, secretAccessKey) {
    this.client = new AWS.S3({
      accessKeyId,
      secretAccessKey,
    });
  }

  async put(request) {
    return new Promise((resolve, reject) => {
      this.client.putObject(request, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }

  createHtmlPutRequest(location, filename, contents) {
    const request = {
      Bucket: location,
      Key: filename,
      Body: contents,
      ContentType: "text/html; charset=utf-8",
      CacheControl: "max-age=60",
    };

    return request;
  }
}

module.exports = { S3Client };

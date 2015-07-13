module.exports = {
  "divesites": {
    "host": process.env.MONGOLAB_HOST,
    "port": process.env.MONGOLAB_PORT,
    "username": process.env.MONGOLAB_USERNAME,
    "password": process.env.MONGOLAB_PASSWORD
  },
  "s3": {
    "key": process.env.AMAZON_KEY,
    "keyId": process.env.AMAZON_KEY_ID
  }
};

console.log('USING DEVELOPMENT DATASOURCES');

module.exports = {
  "divesites": {
    "host": "localhost",
    "port": 27017
  },
  "s3": {
    "name": "s3",
    "connector": "loopback-component-storage",
    "root": "server/uploads",
    "provider": "filesystem"
  }
  /*
     "s3": {
     "key": process.env.AMAZON_KEY,
     "keyId": process.env.AMAZON_KEY_ID
     }
     */
};

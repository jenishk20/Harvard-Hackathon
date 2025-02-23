const { Storage } = require("@google-cloud/storage");

module.exports = {
  storage: new Storage({
    keyFilename: "./googleCreds.json",
  }),
  bucketName: "bill-photo",
};

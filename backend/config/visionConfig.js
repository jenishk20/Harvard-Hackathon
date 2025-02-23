const { ImageAnnotatorClient } = require("@google-cloud/vision");

module.exports = new ImageAnnotatorClient({
  keyFilename: "./googleCreds.json",
});

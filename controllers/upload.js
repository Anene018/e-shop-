require('dotenv').config();
require('express-async-errors');
const multer = require('multer')

//config
var admin = require("firebase-admin");
const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = upload.single();

const uploadFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Please provide a valid file' });
  }
  
  const fileName = file.originalname;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  blobStream.on('error', (err) => {
    res.status(500).json({ error: 'Error uploading file' });
  });

  blobStream.on('finish', () => {
    res.status(200).json({ message: 'File uploaded successfully' });
  });

  blobStream.end(file.buffer);
};

module.exports = {uploadFile , uploadImage}
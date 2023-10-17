const multer = require('multer');
const admin = require('firebase-admin');
const User = require('../models/User');

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

  const userId = req.user.userId;
  const user = await User.findById(userId);

  let imageUrl; 

  blobStream.on('finish', () => {
    blob.getSignedUrl({
      action: 'read',
      expires: '03-09-2100', 
    })
      .then((signedUrls) => {
        imageUrl = signedUrls[0];
        user.profilepicture = imageUrl;
        return user.save();
      })
      .then(() => {
        res.status(200).json({
          message: 'Profile photo has been saved',
          imageUrl,
        });
      })
      .catch((error) => {
        console.error('Error getting image URL:', error);
        res.status(500).json({ error: 'Error getting image URL' });
      });
  });

  blobStream.end(file.buffer);
};

module.exports = { uploadFile, uploadImage };

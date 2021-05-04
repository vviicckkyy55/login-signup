const express = require('express');
const router = express.Router();

const multer = require('multer');

const thumbnailGenerator = require('../helpers/videoThumbnail');
const port = require('../configs/default').port;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'media/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/ /g, '_'));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50  //50mb
    }
});

router.post('/', upload.single('file'), (req, res, next) => {
    thumbnailGenerator.generateThumbnail(
        // /api/videos id made available publically in app.js
        'http://localhost:' + port + '/api/videos/' + req.file.filename.replace(/ /g, '_'),
        req.file.filename.replace(/ /g, '_'),
        req.userData.name);
    res.status(200).json({
        message: 'Video Upload Successful'
    });
});

module.exports = router;
const multer = require("multer");
const fs = require("fs");
// const path = require("path");
// const { now } = require("mongoose");

// Define the destination directory
const uploadDirectory = "./public/imageUpload/products";

// Ensure the destination directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Export the configured multer middleware
const upload = multer({ storage: storage });

module.exports = upload;

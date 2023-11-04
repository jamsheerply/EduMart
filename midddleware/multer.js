const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");

// Define the destination directory
const uploadDirectory = "./public/imageUpload/products";

// Ensure the destination directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Function to generate a random string
function generateRandomString() {
    return crypto.randomBytes(3).toString("hex");
}

// Set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const randomString = generateRandomString();
        cb(null, `${Date.now()}-${randomString}-${file.originalname}`);
    }
});

// Export the configured multer middleware
const upload = multer({ storage: storage });

module.exports = upload;

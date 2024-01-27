const express = require('express');
const multer = require('multer');
const sharp = require("sharp");
const cors = require('cors')
const Fs = require('fs');
const axios = require("axios")

const app = express();
app.use(cors());
const port = 3001;

const setWatermark = async (inputPath, outputPath) => {
    // console.log("dsfds");
    // sharp(`${inputPath}`)
    //     .metadata()
    //     .then(metadata => console.log('Supported formats:', metadata.format))
    //     .catch(error => console.error('Error:', error));

    try {
        await sharp(inputPath).composite([{
            input: "./uploads/logo.png",
            top: 0,
            left: 0,
        }]).toFile(outputPath);

        console.log("Watermark added successfully");
    } catch (err) {
        console.error("Error adding watermark:", err);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
var outputPath;
app.post('/upload', upload.single('file'), async (req, res) => {
    const inputPath = `uploads/${req.file.filename}`;
    outputPath = `uploads/op${req.file.filename}`;

    await setWatermark(inputPath, outputPath);

});

app.get("/dnd", (req, res) => {
    res.download("./" + outputPath, "watermarked.png");
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

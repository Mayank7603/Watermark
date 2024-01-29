const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const zip = require("express-zip")

const app = express();
app.use(cors());
const port = 3001;

const setWatermark = (inputPath, outputPath) => {

    try {
        sharp(inputPath).composite([{
            input: "./uploads/logo.png",
            bottom: 0,
            right: 0,
        }]).toFile(outputPath);

        // console.log("Watermark added successfully setwatermakr");
    } catch (err) {
        // console.error("Error adding watermark:", err);
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
let zipFilePath;


async function makeZip(outputPaths) {

    const zip = new JSZip();
    const folderPath = "./uploads_output";
    var rd = (Math.random() * 100000) / 10;
    zipFilePath = "./yeah" + rd + ".zip";

    const addFilesToZip = async (zipFile, folderPath, currentPath = "") => {
        const temp = [];
        const files = fs.readdirSync(path.join(folderPath, currentPath));

        for (const file of outputPaths) {
            const filePath = path.join(file);
            fileContent = fs.readFileSync(filePath);
            // console.log(Buffer.byteLength(fileContent));
            var tempFile = {
                one: filePath,
                two: fileContent
            }
            temp.push(tempFile);
        }

        for (const abc of temp) {
            zipFile.file(abc.one, abc.two);
        }
    };

    addFilesToZip(zip, folderPath);
    zip.generateAsync({ type: "nodebuffer" }).then((content) => {
        fs.writeFileSync(zipFilePath, content);
    }).catch((error) => console.log(error));;

    console.log(`Zip file created at: ${zipFilePath}`);
}

const outputPaths = [];


app.post('/upload', upload.any('files'), async (req, res) => {
    const arr = req.files;
    arr.forEach(async (singleFile) => {
        // console.log("insert");
        const name = singleFile.originalname;
        const inputPath = `uploads/${name}`;
        const path = `uploads_output/${name}`;
        outputPaths.push(path);
        setWatermark(inputPath, path)
    });

    // console.log(outputPaths);
});

app.get("/download", (req, res) => {

    makeZip(outputPaths);
    setTimeout(() => {
        res.download(zipFilePath);

    }, 3000);

});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

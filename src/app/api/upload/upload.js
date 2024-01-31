const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
var ffmpeg = require("ffmpeg")
const axios = require("axios")

const app = express();
app.use(cors());
const port = 3001;

const setWatermark = (inputPath, outputPath) => {

    try {
        sharp(inputPath).composite([{
            input: "./uploads/logo_2.png",
            gravity: 'southeast',
        }]).toFile(outputPath);
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

// const storageVideo = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploadVideo/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

const upload = multer({ storage });
// const uploadVideo = multer({ storageVideo });
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

var outputPaths = [];
// var OutputVideoPath = [];


app.post('/upload', upload.any('files'), async (req, res) => {
    const arr = req.files;
    console.log(arr);
    arr.forEach(async (singleFile) => {
        const name = singleFile.originalname
        const inputPath = `uploads/${name}`;
        const path = `uploads_output/${name}`;
        outputPaths.push(path);
        setWatermark(inputPath, path)
    });
});



// async function addWatermark(videoURL, watermarkImageURL, outputFileName) {
//     console.log("video watermark start");
//     const apiURL = `https://api.apyhub.com/generate/video/watermark/url/file?output=${outputFileName}`;
//     const requestData = {
//         video_url: videoURL,
//         watermark_image_url: watermarkImageURL
//     };
//     try {
//         const response = await axios.post(apiURL, requestData, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'apy-token': 'APY0SoRbUEhdcJEZhEt4xSGcDByJfjG9vtHFLQbK0nKEZr6fWmv2USxw1eXv9s3fwGvtz'
//             },
//             responseType: 'stream'
//         });
//         if (!response || !response.data) {
//             throw new Error('Empty response received');
//         }
//         const writeStream = fs.createWriteStream(`outputVideo/${outputFileName}`);
//         response.data.pipe(writeStream);
//         return new Promise((resolve, reject) => {
//             writeStream.on('finish', resolve);
//             writeStream.on('error', reject);
//         });
//     } catch (error) {
//         throw new Error('Failed to add watermark. ' + error.message);
//     }
// }

// app.post("/uploadVideo", upload.any(), async (req, res) => {
//     const arr = req.files;
//     console.log(arr); // Check if files are being received
//     arr.forEach(async (singleFile) => {
//         const name = singleFile.originalname;
//         const videoURL = `uploads/${name}`;
//         const outputFilename = `${name.split('.')[0]}.mp4`;
//         const watermarkImageURL = 'uploads/logo.jpg';

//         // OutputVideoPath.push(outputFilename);

//         try {
//             await addWatermark(videoURL, watermarkImageURL, outputFilename);
//             console.log('Watermark added successfully!');
//         } catch (error) {
//             console.error('Error:', error.message);
//         }
//     });

//     console.log("finished");
// });
app.get("/download", (req, res) => {

    makeZip(outputPaths);
    outputPaths = [];
    setTimeout(() => {
        res.download(zipFilePath);

    }, 3000);

});


// async function makeZipVideo(outputPaths) {

//     const zip = new JSZip();
//     const folderPath = "./uploadVideo";
//     var rd = (Math.random() * 100000) / 10;
//     zipFilePath = "./yeah" + rd + ".zip";

//     const addFilesToZip = async (zipFile, folderPath, currentPath = "") => {
//         const files = fs.readdirSync(path.join(folderPath, currentPath));

//         for (const file of outputPaths) {
//             const filePath = path.join(file);
//             fileContent = fs.readFileSync(filePath);
//             // console.log(Buffer.byteLength(fileContent));
//         }

//         for (const abc of temp) {
//             zipFile.file(abc.one, abc.two);
//         }
//     };

//     addFilesToZip(zip, folderPath);
//     zip.generateAsync({ type: "nodebuffer" }).then((content) => {
//         fs.writeFileSync(zipFilePath, content);
//     }).catch((error) => console.log(error));;

//     console.log(`Zip file created at: ${zipFilePath}`);
// }




// app.get("/downloadVideo", (req, res) => {

//     makeZipVideo(OutputVideoPath);
//     OutputVideoPath = [];
//     setTimeout(() => {
//         res.download(zipFilePath);

//     }, 3000);

// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

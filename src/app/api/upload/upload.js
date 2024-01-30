const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

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


app.post('/upload', upload.any('files'), async (req, res) => {
    const arr = req.files;
    arr.forEach(async (singleFile) => {
        const name = singleFile.originalname;
        const inputPath = `uploads/${name}`;
        const path = `uploads_output/${name}`;
        outputPaths.push(path);
        setWatermark(inputPath, path)
    });
});

app.get("/download", (req, res) => {

    makeZip(outputPaths);
    outputPaths = [];
    setTimeout(() => {
        res.download(zipFilePath);

    }, 3000);

});

// var OutputVideoPath = [];

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
// async function addWatermark(videoURL, watermarkImageURL, outputFileName) {
//     const apiURL = 'https://api.apyhub.com/generate/video/watermark/url/file?output=${outputFileName}.mp4'
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
//         const writeStream = fs.createWriteStream('outputVideo/${outputFileName}.mp4');
//         response.data.pipe(writeStream);
//         return new Promise((resolve, reject) => {
//             writeStream.on('finish', resolve);
//             writeStream.on('error', reject);
//         });
//     } catch (error) {
//         throw new Error('Failed to add watermark. ' + error.response.data.error.message);
//     }
// }

// app.post("/uploadVideo", upload.any('videos'), async (req, res) => {
//     const arr = req.videos;

//     console.log("this :  ", arr);
//     // arr.forEach((singleVideo) => {
//     //     const name = singleVideo.originalname;
//     //     const videoURL = `/uploadVideo/${name}`;
//     //     const watermarkImageURL = './uploads/logo.png';
//     //     const outputFilename = `/outputVideo/${name}`;
//     //     OutputVideoPath.push(outputFilename);
//     //     addWatermark(videoURL, watermarkImageURL, outputFilename)
//     //         .then(() => {
//     //             console.log('Watermark added successfully!');
//     //         })
//     //         .catch((error) => {
//     //             console.error('Error:', error.message);
//     //         });
//     // });

// })

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

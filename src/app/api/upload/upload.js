import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from "cloudinary";
import { video } from "@cloudinary/url-gen/qualifiers/source";


const app = express();
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
const port = 3001;


cloudinary.config({
    cloud_name: 'dqct40k0n',
    api_key: '224657579922463',
    api_secret: 'Yje1I9nL1tF64Fka_MNiV-relZs'
});


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
            var fileContent = fs.readFileSync(filePath);
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
var OutputVideoPath = [];


app.post('/upload', upload.any('files'), async (req, res) => {
    const arr = req.files;
    // console.log(arr);
    arr.forEach(async (singleFile) => {
        const name = singleFile.originalname
        const inputPath = `uploads/${name}`;
        const path = `uploads_output/${name}`;
        outputPaths.push(path);
        setWatermark(inputPath, path)
    });
});

const uploadVideo = async (name) => {

    console.log("aa gya ", name);
    try {

        cloudinary.uploader.upload_large(`./uploads/${name}`, { resource_type: 'video', public_id: name }, function (error, result) {
            if (error) {
                console.error("Error uploading file to Cloudinary:", error);
                return res.status(500).json({ error: "Error uploading file to Cloudinary" });
            }

            res.json({
                public_id: result.public_id,
                url: result.secure_url
            });
        });
    } catch (error) {
        console.error("Error handling file upload:", error);
        res.status(500).json({ error: "Error handling file upload" });
    }

}

app.post("/uploadVideo", upload.any(), async (req, res) => {
    const arr = req.files;
    arr.forEach(async (singleFile) => {
        const name = singleFile.originalname;
        const videoURL = `uploads/${name}`;
        const outputFilename = `${name.split('.')[0]}.mp4`;
        const watermarkImageURL = 'uploads/logo.jpg';
        try {

            cloudinary.uploader.upload_large(`./uploads/${name}`, { resource_type: 'video', public_id: name }, function (error, result) {
                if (error) {
                    console.error("Error uploading file to Cloudinary:", error);
                    return res.status(500).json({ error: "Error uploading file to Cloudinary" });
                }

                // console.log("Upload result:", result);
                res.json({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            });
        } catch (error) {
            console.error("Error handling file upload:", error);
            res.status(500).json({ error: "Error handling file upload" });
        }
    });

    console.log("finished");
});

app.get("/download", (req, res) => {

    makeZip(outputPaths);
    outputPaths = [];
    setTimeout(() => {
        res.download(zipFilePath);

    }, 3000);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

import express from "express";
import multer from "multer";
import sharp from "sharp";
import cors from "cors";
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from "cloudinary";

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

const setWatermark = async (inputPath, outputPath) => {

    try {
        sharp(inputPath).resize({ width: 800, height: 600 }).composite([{
            input: "./uploads/logo_2.png",
            gravity: 'southeast',
        }]).toFile(outputPath);
    } catch (err) {
        console.error("Error adding watermark:", err);
    }
}

const setWatermark_iwin = async (inputPath, outputPath) => {

    try {
        sharp(inputPath).resize({ width: 800, height: 600 }).composite([{
            input: "./uploads/logo_5_3.png",
            gravity: 'southeast',
        }]).toFile(outputPath);
    } catch (err) {
        console.error("Error adding watermark:", err);
    }
}

const setWatermark_cm = async (inputPath, outputPath) => {

    try {
        sharp(inputPath).resize({ width: 800, height: 600 }).composite([{
            input: "./uploads/logo_3_3.png",
            gravity: 'southeast',
        }]).toFile(outputPath);
    } catch (err) {
        console.error("Error adding watermark:", err);
    }
}

const setWatermark_both = async (inputPath, outputPath) => {

    try {
        sharp(inputPath).resize({ width: 800, height: 600 }).composite([{
            input: "./uploads/logo_5_3.png",
            gravity: 'northwest',
        }, {
            input: "./uploads/logo_3_3.png",
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
var inputPaths = [];

app.post('/upload', upload.any('files'), async (req, res) => {
    const arr = req.files;
    // console.log(arr);
    console.log("logo type ", req.body.typeLogo);
    const lType = req.body.typeLogo;

    arr.forEach(async (singleFile) => {
        const name = singleFile.originalname
        const inputPath = `uploads/${name}`;
        const path = `uploads_output/${name}`;
        outputPaths.push(path);
        inputPaths.push(inputPath)

        if (lType == 'both') {
            await setWatermark_both(inputPath, path);
        }
        else if (lType == 'iwin') {
            await setWatermark_iwin(inputPath, path);

        } else if (lType == 'cm') {
            await setWatermark_cm(inputPath, path);

        } else {
            await setWatermark(inputPath, path);

        }
    });
});


app.post("/uploadVideo", upload.any(), async (req, res) => {
    const arr = req.files;
    const lType = req.body.typeLogo;
    arr.forEach(async (singleFile) => {
        const name = singleFile.originalname;
        const videoURL = `uploads/${name}`;
        const outputFilename = `${name.split('.')[0]}.mp4`;
        if (lType == 'cm') {

        }
        const watermarkImageURL = 'uploads/logo.jpg';
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
    });

    console.log("finished");
});

const deleteIP = (singleFile) => {
    fs.unlinkSync(singleFile, (err) => {
        if (err) console.log("delete me yeah error h ", err);
        else console.log("Deleted hui hui ", singleFile);
    });
}
const deleteOP = (arr) => {
    arr.forEach((singleFile) => {
        fs.unlinkSync(singleFile, (err) => {
            if (err) console.log("delete me yeah error h ", err);
            else console.log("Deleted hui hui ", singleFile);
        });
    })
}
let tempZip;
app.get("/download", (req, res) => {
    if (!tempZip) {
        console.log("Temp zip is NUll");
    } else {
        console.log(tempZip);
        deleteIP(tempZip)
    }

    makeZip(outputPaths);
    tempZip = zipFilePath;
    deleteOP(outputPaths);
    deleteOP(inputPaths)
    inputPaths = [];
    outputPaths = [];
    setTimeout(() => {
        res.download(zipFilePath);

    }, 3000);

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

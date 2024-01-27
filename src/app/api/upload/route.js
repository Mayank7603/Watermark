import { createRouter } from "next-connect"
import multer from "multer"
import { NextResponse } from "next/server";

const store = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

console.log("mayank");
// const upload = multer({ store });

// const apiRoute = createRouter();

// // apiRoute.use(upload.array("files"));

// apiRoute.post((req, res) => {
//     res.status(200).json({ data: "Success" })
// })

// export async function POST() {
//     return new NextResponse.json({ message: "HI Mayank" });
// }

// export default apiRoute.handler();
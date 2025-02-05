import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./routes/api";
import db from "./utils/database";
import docs from "./docs/route";

const app = express();
const PORT = 3000;

async function init() {
    try {
        const result = await db();
        console.log("Database status: ", result);
        
        app.use(cors());
        app.use(bodyParser.json());
        // Notes From DeepSeek AI
        // Mulai dari versi Express 4.16.0, bodyParser sudah diintegrasikan ke dalam Express.js, 
        // sehingga Anda tidak perlu menginstal bodyParser secara terpisah. 
        // Anda bisa langsung menggunakan express.json() dan express.urlencoded()

        // Add checking endpoint get
        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Server is running!",
                data: null,
            });
        });

        app.use("/api", router);

        docs(app);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
}

init();

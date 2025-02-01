import express from "express";
import bodyParser from "body-parser";

import router from "./routes/api";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
// Notes From DeepSeek AI
// Mulai dari versi Express 4.16.0, bodyParser sudah diintegrasikan ke dalam Express.js, 
// sehingga Anda tidak perlu menginstal bodyParser secara terpisah. 
// Anda bisa langsung menggunakan express.json() dan express.urlencoded()

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bodyParser from "body-parser";
import secret from "./secret.js";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
    const path1 = join(__dirname, "/public/index.html");
    console.log(__dirname);
    res.sendFile(path1);
});

app.post("/check", (req, res) => {
    const text = req.body.password;
    const path1 = (text === secret) ? join(__dirname, "/public/secret.html") : join(__dirname, "/public/index.html");
    res.sendFile(path1);
});

app.listen(port, () => {
    console.log(`Server running on ${port}.`);
});

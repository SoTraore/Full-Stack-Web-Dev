import express from "express";
import morgan from "morgan";

let app = express();
let port = 3000;

app.use(morgan('combined'));

// Creating our own middleware

function logger(req, res, next) {
    console.log("Request method : ", req.method);
    console.log("Host : ", req.headers.host);
    console.log("Request url : ", req.url);
    next();
}

app.use(logger);

// app.use((req, res, next)=>{
//     console.log("Request method : ",req.headers);
//     next();
// });

app.get("/", (req,res)=>{
    res.send("<h1>Hello world !!</h1>");
});

app.listen(port, (req,res)=>{
    console.log(`Server running on ${port}.`);
});
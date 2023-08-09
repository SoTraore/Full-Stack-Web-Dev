import express from "express"
import bodyParser from "body-parser"


let app = express()
let port = 3000

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.render("index.ejs");
});

// app.get("", (req, res)=>{

// });

app.listen(port, (req,res)=>{
    console.log('The server is running on port : '+port);
});
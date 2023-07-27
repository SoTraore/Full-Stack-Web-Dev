import express from "express"
import bodyParser from "body-parser"
import {getISOWeekNumber} from "./function.js"

let app = express();
let port = 3000;


let messages = [];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res)=>{
    res.render("index.ejs");
});

app.get("/home", (req,res)=>{
    res.render("index.ejs");
});

app.get("/create", (req, res)=>{
    res.render('create.ejs');
});

app.get("/about", (req, res)=>{
    res.render('about.ejs', {messages});
});

app.get("/contact", (req,res)=>{
    res.render('contact.ejs');
});

app.post("/contact", (req,res)=>{
    let data = req.body ;
    messages.push(data);
    res.render('about.ejs', {messages});
});

app.post("/create", (req, res) => {
    let operation = [];
    let dateDebut = [];
    let dateFinReelle = [];
    let dateFinSouhaitee = [];
    let weekDebut = [];
    let weekFinReelle = [];
    let weekFinSouhaitee = [];

    let count = parseInt(req.body.rowCount);

    for (let i = 0; i < count; i++) {
        operation.push(req.body[`operation${i}`]);
        dateDebut.push(req.body[`dateDebut${i}`]);
        weekDebut.push(getISOWeekNumber(new Date(req.body[`dateDebut${i}`])));
        dateFinSouhaitee.push(req.body[`dateFinSouhaitee${i}`]);
        weekFinSouhaitee.push(getISOWeekNumber(new Date(req.body[`dateFinSouhaitee${i}`])));
        dateFinReelle.push(req.body[`dateFinReelle${i}`]);
        weekFinReelle.push(getISOWeekNumber(new Date(req.body[`dateFinReelle${i}`])));
    }

    res.render('gantt.ejs', {
        operation,
        dateDebut,
        dateFinReelle,
        dateFinSouhaitee,
        count,
        weekDebut,
        weekFinReelle,
        weekFinSouhaitee
    });
});


app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
});
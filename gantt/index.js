import express from "express"
import bodyParser from "body-parser"
import {getISOWeekNumber} from "./function.js"
import { Gantt } from "./database.js";

let app = express();
let port = 3000;

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

app.post("/create", async (req, res) => {
    let count = parseInt(req.body.rowCount);

    for (let i = 0; i < count; i++) {
        let elt = new Gantt({
            operation: req.body[`operation${i}`],
            dateDebut: req.body[`dateDebut${i}`],
            dateFinReelle: req.body[`dateFinReelle${i}`],
            dateFinSouhaitee: req.body[`dateFinSouhaitee${i}`],
            weekDebut: getISOWeekNumber(new Date(req.body[`dateDebut${i}`])),
            weekFinReelle: getISOWeekNumber(new Date(req.body[`dateFinReelle${i}`])),
            weekFinSouhaitee: getISOWeekNumber(new Date(req.body[`dateFinSouhaitee${i}`])),
        });

        try {
            await elt.save();
            console.log("New element added!");
        } catch (error) {
            console.error("Error saving element:", error);
        }
    }

    try {
        const data = await Gantt.find();
        console.log(data);
        res.render('gantt.ejs', {
            data,
            count
        });
    } catch (error) {
        console.error("Error fetching Gantt data:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
});
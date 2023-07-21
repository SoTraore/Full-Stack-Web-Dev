import express from 'express';
import bodyParser from 'body-parser';

let app = express();
let port = 3000 ;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {
    let day = new Date() ;
    let num = getRandomInt(0,6) ;
    day.setDate(day.getDate()+num);
    let moment = (day.getDay() === 0 || day.getDay() === 6) ? 'Weekend' : 'Weekday' ;
    let activity = (moment == 'Weekend') ? 'Have fun' : "Hard working";

    let value1 = {data1:moment, data2:activity};
    let value2 = {
        title:"EJS Tags",
        seconds: new Date().getSeconds(),
        items: ['apple', 'Banana', 'cherry'],
        htmlContent: "<em>This is some em text</em>",
    } ;
    let final = {data:value1, object:value2};
    res.render('index.ejs', {final});
});

app.get('/welcome', (req, res)=>{
    res.render('welcome.ejs');
})

app.post("/welcome", (req, res) => {
    let fname = req.body['fname'];
    let lname = req.body['lname'];
    res.render('welcome.ejs', {fname: fname, lname:lname, letters:(fname+lname).length});
});


app.listen(port, () => {
    console.log(`Server listening on ${port}.`);
});
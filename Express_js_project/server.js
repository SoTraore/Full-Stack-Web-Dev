let express = require('express');
let path = require("path");
let bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, 'index.html');
    res.sendFile(filePath);
}); 

app.post('/', (req, res) => {
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let result = num1 + num2;
    res.send("Your addition result is: " + result);
});

app.get('/bmiCalculator', (req, res) => {
    const filePath = path.resolve(__dirname, 'bmiCalculator.html');
    res.sendFile(filePath);
}) ;

app.post('/bmiCalculator', (req, res) => {
    let weigth = Number(req.body.weigth);
    let heigth = Number(req.body.heigth);
    let result = weigth / (heigth * heigth) ;
    res.send("Your BMI calcul result : " + Math.round(result, 2));
});
  
app.get('/about', (req, res) => {
  res.send("<p>I'm Souleymane, a cybersecurity student.</p>");
});

app.get('/contact', (req, res) => {
  res.send("<p>My email is: soultra@yahoo.com</p>");
});

const port = 3000;

app.listen(port, () => {
  console.log('Server running on port ' + port);
});

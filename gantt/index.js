import express from "express";
import bodyParser from "body-parser";
import { Gantt, Users } from "./database.js";
import { getISOWeekNumber } from "./function.js";
import session from "express-session";
 

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(
    session({
        secret: 'your_secret_key', // Replace with a strong and secure secret key
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            maxAge: 60 * 60 * 1000, // Session duration in milliseconds (1 hour in this example)
        },
    })
);

app.set('view engine', 'ejs'); // Set EJS as the template engine

app.get('/', (req, res)=>{
    if (req.session.user) {
        res.render("index.ejs");
    }
    else {
        res.render("login.ejs");
    }
});

app.get('/home', (req, res)=>{
    if (req.session.user) {
        res.render("index.ejs");
    }
    else {
        res.render("login.ejs");
    }
});

app.get('/account', (req,res)=>{
    if (!req.session.user) {
        res.render('createAccount.ejs');
    }
    else {
        res.render("login.ejs");
    }
});

app.post("/account", async (req, res) => {
    try {
    const { email, username, password, country } = req.body;
    console.log(req.body);
    let message = "";

    if (password.length < 8 || username.length < 8) {
        message = "Invalid input";
        return res.render("login.ejs", { message });
    } else {
        message = "User created successfully ;-)";
        const user = new Users({ email, username, password, country });
        await user.save();
        return res.render("index.ejs");
    }
    } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
    }
});

app.get('/login', (req, res)=>{
    if (req.session.user) {
        res.render("index.ejs");
    }
    else {
        res.render("login.ejs");
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Authentication (Replace this with your actual authentication logic)
    const user = await Users.findOne({ email:email, password:password });

    if (user) {
        // Set user data in the session
        req.session.user = user;
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// Route to check if the user is logged in
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}!`);
    } else {
        res.send('You are not logged in.');
    }
});

// Route for user logout
app.get('/logout', (req, res) => {
    // Destroy the session and clear the session data
    req.session.destroy((err) => {
        if (err) {
        console.error('Error destroying session:', err);
        }
        res.redirect('/login'); // Redirect the user to the login page or any other page
    });
});

// app.post("/newUser", (req,res)=>{
//     let {username, password} = req.body ;
//     let elt = Users.find({username : {"username":username}}) ;
//     let message = "";
//     if (password.length < 8 || username.length < 8) {
//         message = "Invalid input";
//         res.render("login.ejs", {message});
//     }
//     else {
//         message = "Users created succefully ;-)";
//         res.render("index.ejs", {message});
//     }
// });

app.get("/create", (req, res)=>{
    if (req.session.user){
        res.render('create.ejs');
    }
    else {
        res.render("login.ejs");
    }
});

app.post("/create", async (req, res) => {
    if (req.session.user) {
        let count = parseInt(req.body.rowCount), elt;
        for (let i = 0; i < count; i++) {
            elt.push({
                operation: req.body[`operation${i}`],
                dateDebut: req.body[`dateDebut${i}`],
                dateFinReelle: req.body[`dateFinReelle${i}`],
                dateFinSouhaitee: req.body[`dateFinSouhaitee${i}`],
                weekDebut: getISOWeekNumber(new Date(req.body[`dateDebut${i}`])),
                weekFinReelle: getISOWeekNumber(new Date(req.body[`dateFinReelle${i}`])),
                weekFinSouhaitee: getISOWeekNumber(new Date(req.body[`dateFinSouhaitee${i}`])),
            });
        }
        
        let newItem = new Gantt({
            username : "helloWorld",
            gantt_id : "superpassword",
            data : elt,
        });
    
        try {
            await newItem.save();
            console.log("New element added!");
        } catch (error) {
            console.error("Error saving element:", error);
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
    }
    else {
        res.render("login.ejs");
    }
});

app.get("/about", (req, res)=>{
    if (req.session.user){
        res.render('about.ejs', {messages});
    }
    else {
        res.render("login.ejs");
    }
});

app.get("/contact", (req,res)=>{
    if (req.session.user){
        res.render('contact.ejs');
    }
    else {
        res.render("login.ejs");
    }
});

app.post("/contact", (req,res)=>{
    if (req.session.user) {
        let data = req.body ;
        messages.push(data);
        res.render('about.ejs', {messages});
    }
    else {
        res.render("login.ejs");
    }
});

app.listen(port, ()=>{
    console.log("Server runing on port "+port);
});
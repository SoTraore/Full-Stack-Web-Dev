import express from "express";
import bodyParser from "body-parser";
import { Gantt, Users, Messages } from "./database.js";
import { getISOWeekNumber } from "./function.js";
import session from "express-session";
 

const app = express();
const port = 3000;
let gantt_id = 1;

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
    res.render("welcome_page.ejs");
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

app.get("/gantt", (req, res)=>{
    if (req.session.user){
        res.render('createGantt.ejs');
    }
    else {
        res.render("login.ejs");
    }
});

app.post("/gantt", async (req, res) => {
    if (req.session.user) {
        let count = parseInt(req.body.rowCount), elt = [];

        let debut = 1000;
        let finReel = 0;
        let finSouh = 0;

        for (let i = 0; i < count; i++) {
            let debutCur = getISOWeekNumber(new Date(req.body[`dateDebut${i}`]));
            let finReelCur = getISOWeekNumber(new Date(req.body[`dateFinReelle${i}`]));
            let finSouhCur = getISOWeekNumber(new Date(req.body[`dateFinSouhaitee${i}`]));
            elt.push({
                operation: req.body[`operation${i}`],
                dateDebut: req.body[`dateDebut${i}`],
                dateFinReelle: req.body[`dateFinReelle${i}`],
                dateFinSouhaitee: req.body[`dateFinSouhaitee${i}`],
                weekDebut: debutCur,
                weekFinReelle: finReelCur,
                weekFinSouhaitee: finSouhCur,
            });
            if (debut > debutCur) {
                debut = debutCur; 
            }
            if (finReel < finReelCur) {
                finReel = finReelCur;
            }
            if (finSouh < finSouhCur) {
                finSouh = finSouhCur;
            }
        }
        
        const currentDate = new Date();
        const version = currentDate.toISOString();

        const userData = req.session.user ? req.session.user.data : null;

        let newItem = new Gantt({
            user: userData,
            version: version,
            data: elt
        });
    
        try {
            await newItem.save();
            console.log("New element added!");
        } catch (error) {
            console.error("Error saving element:", error);
        }
    
        try {
            const messages = await Gantt.find({version: version});
            console.log(messages);
            res.render('classic_gantt.ejs', {messages, count, debut, finReel, finSouh});
        } catch (error) {
            console.error("Error fetching Gantt data:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.render("login.ejs");
    }
});

app.get("/about", async (req, res)=>{
    if (req.session.user){
        // let data = Users.find({})
        let messages = await Messages.find({email:req.session.user.email}).limit(10);
        if (messages) {
            res.render('about.ejs', {messages});
        }
        else {
            res.redirect('/contact');
        }
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

app.post("/contact", async (req,res)=>{
    if (req.session.user) {
        let {name, subject, message, email} = req.body ;
        try {
            let newItem = new Messages({
                name: name,
                email: email,
                subject: subject,
                message: message,
            }) ;
            await newItem.save().then(()=>{
                console.log("The messages has been saved.");
            });
        }
        catch (error) {
            console.log(error);
        }

        try {
            let messages = await Messages.find();
            console.log(messages);
            res.render('about.ejs', {messages});
        }
        catch (error) {
            console.log(error);
        }

    }
    else {
        res.render("login.ejs");
    }
});

app.get("/planning", (req, res)=> {
    if (req.session.user) {
        res.render("./planning/planning.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/cours', (req, res)=>{
    if (req.session.user) {
        res.render("./menu/cours.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/archives', (req, res)=>{
    if (req.session.user) {
        res.render("./menu/archives.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/formations', (req, res)=>{
    if (req.session.user) {
        res.render("./menu/formations.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/quiz', (req, res)=>{
    if (req.session.user) {
        res.render("./menu/quiz.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/events', (req, res)=>{
    if (req.session.user) {
        res.render("./menu/events.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/offres', (req, res)=>{
    if (req.session.user) {
        res.render("./menu/offres.ejs");
    }
    else {
        res.redirect('/login');
    }
});

app.listen(port, ()=>{
    console.log("Server runing on port "+port);
});
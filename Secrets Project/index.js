import axios from "axios";
import express from "express";

let app = express();
let port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res)=>{
    try {
        let result = await axios.get("https://secrets-api.appbrewery.com/random");
        let data = result.data ;
        res.render('index.ejs',{secret:data.secret, user:data.username});
    }
    catch (error) {
        res.render('index.ejs', {error});
    }
});

app.listen(port, ()=>{
    console.log(`Server running on ${port}`);
});
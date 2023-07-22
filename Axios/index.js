import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
    let type = req.body.type;
    let participants = req.body.participants;
    try {
        let response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`)
        let result = response.data ;
        let index = Math.floor(Math.random()*result.length);
        res.render("index.ejs", {data: result[index]});
    }
    catch (error) {
        res.render("index.ejs", {error});
    }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

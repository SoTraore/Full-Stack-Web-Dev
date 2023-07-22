import express from "express";
import axios from "axios";
import secret from "./secret.js" 
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = secret.username;
const yourPassword = secret.password;
const yourAPIKey = secret.apiKey;
const yourBearerToken = secret.bearerToken;

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    let response = await axios.get(`${API_URL}/random`);
    let result = response.data ;
    res.render('index.ejs', {content: JSON.stringify(result)});
  }
  catch (error) {
    res.render('index.ejs', {error})
  }

});

app.get("/basicAuth", async (req, res) => {
  // https://stackoverflow.com/a/74632908

    try {
      let response = await axios.get(`${API_URL}/all?page=6`, {
        auth : {
          username: yourUsername,
          password: yourPassword,
        }
      });

      let result = response.data ;
      res.render('index.ejs', {content: JSON.stringify(result)});
    }
    catch (error) {
      res.render('index.ejs', {error})
    }
});

app.get("/apiKey", async (req, res) => {
  try {
    let response = await axios.get(`${API_URL}/filter?score=5&apiKey=${yourAPIKey}`, {
      auth : {
        username: yourUsername,
        password: yourPassword
      }
    });
    
    let result = response.data ;
    res.render('index.ejs', {content: JSON.stringify(result)});
  }
  catch (error) {
    res.render('index.ejs', {error})
  }

});

app.get("/bearerToken", async (req, res) => {
  // https://stackoverflow.com/a/52645402
  try {
    const userSecretsResponse = await axios.get(`${API_URL}/secrets/1`, {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    });
  
    const userSecretsData = userSecretsResponse.data;
    res.render('index.ejs', { content: JSON.stringify(userSecretsData) });
  } catch (error) {
    res.render('index.ejs', { error });
  }
  
});

app.get('/postSecret', (req, res)=> {
  res.render('add.ejs');
});

app.post('/postSecret', async (req,res)=>{
  let my_secret = req.body.secret ;
  let my_score = req.body.secret ;

  const postData = {
    secret: my_secret,
    score: my_score,
  };
  
  // Perform the POST request with the Bearer Token in the header
  axios.post(`${API_URL}/secrets`, postData, {
    headers: {
      Authorization: `Bearer ${yourBearerToken}`,
    },
  }).then((response) => {
    let data = response.data;
    console.log(data);
    res.render("add.ejs", {data});
  }).catch((error) => {
    console.error("Error:", error);
  });

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

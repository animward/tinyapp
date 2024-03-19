//express_server.js
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const { generateRandomString } = require('./randomString');

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// url database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// root test
app.get("/", (req, res) => {
  res.send("Hello!");
});

// listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// render new URL form
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

// display URL list
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

// display URL details
app.get("/urls/:id", (req, res) => {
    const id = req.params.id;
    const longURL = urlDatabase[id];
    const templateVars = { id: id, longURL: longURL};
    res.render("urls_show", templateVars);
});

//handle JSON reponse of URL database
app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

// handle HTML response of URL database
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// add new URL to database
app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
});

// redirect to long URL
app.get("/u/:id", (req, res) => {
    const shortURL = req.params.id;
    const longURL = urlDatabase[shortURL];
    if (longURL) {
        res.redirect(longURL);
    } else {
        res.status(404).send("URL not found");
    }
});

// delete URL from database
app.post("/urls/:id/delete", (req, res) => {
    const urlID = req.params.id;
    const longURL = urlDatabase[urlID];
    if (longURL && longURL !== "") {
        delete urlDatabase[urlID];
        res.redirect("/urls");
    } else {
        res.status(404).send("URL not found");
    }
  
});

// update URL in database
app.post("/urls/:id", (req, res) => {
    const urlID = req.params.id;
    const newURL = req.body.newLongURL;
    if (newURL === "") {
        if (urlDatabase[urlID]) {
            res.redirect("/urls");
        } else {    
            res.status(404).send("URL not found");
        }   
    } else {
        if (urlDatabase[urlID]) {
    urlDatabase[urlID] = newURL;
    res.redirect("/urls");
    } else {
    res.status(404).send("URL not found");
    }
}
    
});

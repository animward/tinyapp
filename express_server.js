//express_server.js
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const { generateRandomString } = require('./randomString');

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

app.get("/urls/:id", (req, res) => {
    const id = req.params.id;
    const longURL = urlDatabase[id];
    const templateVars = { id: id, longURL: longURL};
    res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.post("/urls", (req, res) => {
    const shortURL = generateRandomString();
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:id", (req, res) => {
    const shortURL = req.params.id;
    const longURL = urlDatabase[shortURL];
    if (longURL) {
        res.redirect(longURL);
    } else {
        res.status(404).send("URL not found");
    }
});

app.post("/urls/:id/delete", (req, res) => {
    const urlID = req.params.id;
    if (urlDatabase[urlID]) {
        delete urlDatabase[urlID];
        res.redirect("/urls");
    } else {
        res.status(404).send("URL not found");
    }
  
});

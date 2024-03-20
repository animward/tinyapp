//express_server.js
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const { generateRandomString } = require('./randomString');

const {addUser, findUserByEmail } = require('./users');

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

//login
app.post("/login", (req, res) => {
    const email = req.body.email;
    res.cookie('username', email);
    res.redirect("/urls");
});

// logout
app.post("/logout", (req, res) => {
    res.clearCookie('username');
    res.redirect("/urls");
});

// register
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send("Username or password cannot be empty");
    } else if (findUserByEmail(email)) {
        res.status(400).send("User already exists");
    } else {
        const userID = generateRandomString();
        addUser(userID, email, password);
        res.cookie('userid', userID);
        res.redirect("/urls");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

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
    const templateVars = { username: req.cookies["username"] };
    res.render("urls_new", templateVars);
});

// display URL list
app.get("/urls", (req, res) => {
    const templateVars = { 
        username: req.cookies["username"],
        urls: urlDatabase 
    };
    res.render("urls_index", templateVars);
  });

// display URL details
app.get("/urls/:id", (req, res) => {
    const id = req.params.id;
    const longURL = urlDatabase[id];
    const templateVars = {
        id: id,
        longURL: longURL,
        username: req.cookies["username"]
        };
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
    res.redirect(`/urls`);
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

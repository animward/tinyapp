//express_server.js
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcryptjs');

const { generateRandomString } = require('./randomString');

const {addUser, findUserByEmail } = require('./users');
const e = require("express");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

//login
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = findUserByEmail(email);
    if (!user) {
        res.status(403).send("Invalid username or password");
        return;
    }
    if (!bcrypt.compareSync(password, user.password)) {
        res.status(403).send("Invalid username or password");
        return;
    }

    res.cookie('userid', user.id);
    res.cookie('email', email);
    res.redirect("/urls");

});

// logout
app.post("/logout", (req, res) => {
    res.clearCookie('email');
    res.clearCookie('userid');
    res.redirect("/urls");
});

// register
app.get("/register", (req, res) => {
    res.render("register", { email: req.cookies["email"] });
});

app.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send("Username or password cannot be empty");
        return
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);

    if (findUserByEmail(email)) {
        res.status(400).send("User already exists");
        return;
    }

        const userID = generateRandomString();
        addUser(userID, email, hashedPassword);
        res.cookie('userid', userID);
        res.redirect("/login");

});

app.get("/login", (req, res) => {
    res.render("login", { email: req.cookies["email"] });
});

// url database
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2" }
};

// filter URL database by user
const urlsForUser = (id) => {
    const userURLs = {};
    for (const shortURL in urlDatabase) {
        if (urlDatabase[shortURL].userID === id) {
            userURLs[shortURL] = urlDatabase[shortURL];
        }
    }
    return userURLs;
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
    const templateVars = { email: req.cookies["email"] };
    res.render("urls_new", templateVars);
});

// display URL list
app.get("/urls", (req, res) => {
    const userID = req.cookies["userid"];
    if (!userID) {
     //   res.status(401).send("Login or register");
        return res.redirect("/login");
    }
    const userURLs = urlsForUser(userID);
    const templateVars = { 
        email: req.cookies["email"],
        urls: userURLs 
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
        email: req.cookies["email"]
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

    if (!longURL) {
        res.status(400).send("URL cannot be empty");
        return;
    }
    urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies["userid"] };
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
    const userID = req.cookies["userid"];
    const urlID = req.params.id;
    const userURLs = urlsForUser(userID);
    if (!userURLs[urlID]) {
        res.status(403).send("You do not have permission to delete this URL.");
        return;
    }
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
    const userID = req.cookies["userid"];
    const urlID = req.params.id;
    const userURLs = urlsForUser(userID);
    
    if (!userURLs[urlID]) {
        res.status(403).send("You do not have permission to edit this URL.");
        return;
    }

    const newURL = req.body.newLongURL;
    
    if (!newURL) {
        res.status(400).send("URL cannot be empty");
        return;
    }

    urlDatabase[urlID].longURL = newURL;
    res.redirect("/urls");
});

var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

let users = [
  {
    name: "alice",
    password: "password123",
    balance: 600,
  },
  {
    name: "eve",
    password: "blah",
    balance: 50,
  },
  {
    name: "bob",
    password: "meh",
    balance: 120,
  },
];

let sessions = {};

app.get("/", (req, res) => {
  let source = req.query.source;
  let welcome = source ? `Welcome ${source} reader` : "Welcome to the bank";
  res.send(`
        <h1>${welcome}</h1>
        <a href="/login">Click here to login</a>
    `);
});

app.get("/login", (req, res) => {
  let sessionId = req.cookies["sessionId"];
  if (!sessionId) {
    res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
        Name
        <input type="text" name="name" />
        Password
        <input type="password" name="password" />
        <input type="submit" value="Login" />
    </form>
    `);
  } else {
    res.redirect("/transfer");
  }
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  let user = users.find((u) => u.name === name && u.password === password);
  if (!user) {
    res.send("Invalid username or password");
    return;
  }
  let sessionId = uuidv4();
  sessions[sessionId] = user;
  res.cookie("sessionId", sessionId);
  res.redirect("/transfer");
});

app.get("/logout", (req, res) => {
  res.clearCookie("sessionId");
  res.redirect("/");
});

app.get("/transfer", (req, res) => {
  let sessionId = req.cookies["sessionId"];
  let user = sessions[sessionId];
  if (!user) {
    res.send("Not logged in");
    return;
  }
  res.send(`
    <h1>Welcome ${user.name}</h1>
    Current balance: ${user.balance}
    <br /><br />
    Transfer money<br />
    <form method="POST" action="transfer">
        to:
        <input type="text" name="to" />
        amount:
        <input type="text" name="amount" />
        <input type="submit" value="Transfer" />
    </form>
    `);
});

app.post("/transfer", (req, res) => {
  let sessionId = req.cookies["sessionId"];
  let user = sessions[sessionId];
  if (!user) {
    res.send("Not logged in");
    return;
  }
  const { amount, to } = req.body;
  let recipient = users.find((u) => u.name === to);
  recipient.balance += new Number(amount);
  user.balance -= new Number(amount);
  res.redirect("/transfer");
});

app.get("/register", (req, res) => {
  res.send(`
    <form action="/register" method="POST">
        <h1>Register</h1>
        Username
        <input type="text" name="name" />
        Password
        <input type="text" name="password" />
        <input type="submit" value="Register" />
    </form>
    `);
});

app.post("/register", (req, res) => {
  const { name, password } = req.body;
  users.push({
    name,
    password,
    balance: 0,
  });
  res.redirect("/");
});

app.listen(4000, "127.0.0.1");

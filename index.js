const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mustacheExpress = require("mustache-express");

const { v4: uuidv4 } = require("uuid");

const app = express();

const environment = app.get("env");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

let users = [
  {
    name: "alice",
    password: "password123",
    balance: 60250,
  },
  {
    name: "eve",
    password: "123456",
    balance: 20,
  },
];

let sessions = {};

const isLoggedIn = (req) => req.cookies["sessionId"] !== undefined;

const login = (res, user) => {
  let sessionId = uuidv4();
  sessions[sessionId] = user;
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "strict",
  });
};

app.get("/", (req, res) => {
  const source = req.query.source;
  const title = source
    ? `Welcome ${source} member`
    : "Welcome to the insecure bank";

  res.render("welcome", {
    title,
    loggedIn: isLoggedIn(req),
  });
});

app.get("/login", (req, res) => {
  if (!isLoggedIn(req)) {
    res.render("login");
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
  login(res, user);
  res.redirect("/transfer");
});

app.get("/logout", (req, res) => {
  res.clearCookie("sessionId");
  res.redirect("/login");
});

app.get("/transfer", (req, res) => {
  let sessionId = req.cookies["sessionId"];
  let user = sessions[sessionId];
  if (!user) {
    res.clearCookie("sessionId");
    res.redirect("/login");
    return;
  }
  res.render("transfer", {
    name: user.name,
    balance: user.balance,
  });
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
  res.render("register");
});

app.post("/register", (req, res) => {
  const { name, password } = req.body;
  let user = {
    name,
    password,
    balance: 100, // free money!
  };
  users.push(user);
  login(res, user);

  res.redirect("/transfer");
});

if (environment === "development") {
  app.listen(4000, "127.0.0.1");
} else {
  app.listen(80, "0.0.0.0");
}

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const { verifyJWT, deviceCheck, ztaLogger } = require("./MIDDLEWARE/auth");

const app = express();
const SECRET_KEY = "mybank_zta_secret";

app.use(cors());
app.use(express.json());
app.use(ztaLogger);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// demo user
let user = {
  username: "admin",
  password: "1234",
  balance: 50000
};

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "5m" });

  res.json({ token, balance: user.balance });
});

// TRANSFER (ZTA protected)
app.post("/transfer", verifyJWT, deviceCheck, (req, res) => {
  const { amount } = req.body;

  if (amount > 10000) {
    return res.status(403).json({ message: "Blocked by ZTA policy" });
  }

  if (amount > user.balance) {
    return res.status(403).json({ message: "Insufficient balance" });
  }

  user.balance -= amount;
  res.json({ balance: user.balance });
});

// default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
  console.log("MyBank ZTA app running on http://localhost:3000");
});

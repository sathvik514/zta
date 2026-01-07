const jwt = require("jsonwebtoken");

const SECRET_KEY = "mybank_zta_secret";

// Identity verification
function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// Device & context verification
function deviceCheck(req, res, next) {
  const userAgent = req.headers["user-agent"];
  if (!userAgent) {
    return res.status(403).json({ message: "Untrusted device" });
  }

  console.log("ZTA Device:", userAgent);
  console.log("ZTA IP:", req.ip);

  next();
}

// Continuous monitoring
function ztaLogger(req, res, next) {
  console.log(`[ZTA LOG] ${req.method} ${req.url} | IP: ${req.ip}`);
  next();
}

module.exports = { verifyJWT, deviceCheck, ztaLogger };

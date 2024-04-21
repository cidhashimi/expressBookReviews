const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if access token is provided in the request header
  const accessToken = req.headers.authorization;

  // If no access token provided, return unauthorized status
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, "your_secret_key");

    // If verification successful, set user information in session
    req.session.user = decoded;

    // Move to the next middleware
    next();
  } catch (err) {
    // If verification fails, return unauthorized status
    return res.status(401).json({ message: "Unauthorized" });
  }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

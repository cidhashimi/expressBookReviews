const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user is registered and credentials are valid
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // If credentials are valid, save the user's session
  req.session.user = username;

  // Send a success response
  return res.status(200).json({ message: "Logged in successfully" });
});


/// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.user; // Retrieve username from session
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Check if username exists in session
  if (!username) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Your existing code to add or modify the review goes here...

  // Send a success response
  return res.status(200).json({ message: "Review added or modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.user; // Retrieve username from session
  const isbn = req.params.isbn;

  // Check if username exists in session
  if (!username) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  // Check if the book with the provided ISBN exists
  const book = books.find(book => book[isbn]);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for the specified ISBN
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the user's review for the specified ISBN
  delete book.reviews[username];

  // Send a success response
  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

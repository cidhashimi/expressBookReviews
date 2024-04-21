const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.hasOwnProperty(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Store the new user in the users object
  users[username] = password;

  // Return success message
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Convert the books array to JSON and send it as response
  const booksJSON = JSON.stringify(books, null, 2);
  return res.status(200).send(booksJSON);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books.find(book => book.id == isbn); // Use 'id' instead of 'isbn'
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).json(book);
});


/// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  console.log("Author:", author); // Debugging statement

  // Initialize an array to store books matching the provided author
  const booksByAuthor = [];

  // Iterate through the books array and check if the author matches
  books.forEach(book => {
    console.log("Book author:", book.author); // Debugging statement
    if (book.author === author) {
      // If a match is found, push the book details to the array
      booksByAuthor.push(book);
    }
  });

  console.log("Books by author:", booksByAuthor); // Debugging statement

  // If no books are found for the provided author, return a 404 response
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  // Return the array of books by the author
  return res.status(200).json(booksByAuthor);
});


// Get book details based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  // Initialize an array to store books matching the provided title
  const booksByTitle = [];

  // Iterate through the books array and check if the title matches
  for (const book of books) {
    // Check if the 'title' property exists in the book object before accessing it
    if (book.title && book.title.toLowerCase().includes(title.toLowerCase())) {
      // If a match is found, push the book details to the array
      booksByTitle.push(book);
    }
  }

  // If no books are found for the provided title, return a 404 response
  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  // Return the array of books with the matching title
  return res.status(200).json(booksByTitle);
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  
  // Find the book with the provided ISBN
  const book = books.find(book => book.isbn === isbn);
  
  // If the book is not found, return a 404 response
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // If the book has no reviews, return a message indicating no reviews
  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.status(200).json({ message: "No reviews available for this book" });
  }

  // If the book has reviews, return the reviews
  return res.status(200).json({ reviews: book.reviews });
});


module.exports.general = public_users;

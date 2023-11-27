const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login!" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Username and / or Password are not provided." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    return res.status(200).json(books[req.params.isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let booksByAuthor = [];
    Object.keys(books).forEach(function (key, index) {
        if (books[key].author === req.params.author) {
            booksByAuthor.push({
                isbn: key,
                title: books[key].title,
                reviews: books[key].reviews,
            });
        }
    });

    return res.status(200).json({ booksByAuthor: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let booksByTitle = [];
    Object.keys(books).forEach(function (key, index) {
        if (books[key].title === req.params.title) {
            booksByTitle.push({
                isbn: key,
                author: books[key].author,
                reviews: books[key].reviews,
            });
        }
    });

    return res.status(200).json({ booksByTitle: booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;

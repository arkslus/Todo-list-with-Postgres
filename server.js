// Require postgres
const { Pool } = require("pg");

const pool = new Pool({
  user: "your username",
  password: "123456",
  host: "localhost",
  port: 1234, // default Postgres port
  database: "your database name",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

pool.connect();

// Require express app
const express = require("express");
const app = express();

// Require path
const path = require("path");
// set path to views
app.set("views", path.join(__dirname, "views"));
// Set the view engine for the ejs file
app.set("view engine", "ejs");

// Middleware
// for post request, we will need url encoded
app.use(express.urlencoded({ extended: true }));
// This is to use the public file
app.use(express.static("public"));

let items = [
  { id: 1, title: "Learn Python" },
  { id: 2, title: "Learn Javascript" },
];

// Get list of items from database
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "2025",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

// add new item to database
app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    await pool.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// edit an item in the database
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await pool.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

// delete an item from the database
app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000!");
});

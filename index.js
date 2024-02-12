const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define mongoose schema for your data
const userDataSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
});

// Create a mongoose model
const UserData = mongoose.model("UserData", userDataSchema);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Define routes for home, about, contact, login, and signup pages
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Handle POST request for signup
app.post("/signup", async (req, res) => {
  try {
    // Create a new user data instance
    const newUser = new UserData({
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email,
    });
    // Save the new user data to MongoDB
    await newUser.save();
    res.send("User data saved successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving user data.");
  }
});
// Handle POST request for login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Here you can add your logic to authenticate the user based on the provided email and password
    // For demonstration purposes, let's assume authentication is successful
    res.send("Login successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during login.");
  }
});
app.get("/logout", (req, res) => {
  // Destroy the session or clear the authentication token
  // For example, if you are using sessions:
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging out.");
    } else {
      // Redirect the user to the login page after logout
      res.redirect("/login");
    }
  });
});
// Define mongoose schema for contact data
const contactDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Create a mongoose model for contact data
const ContactData = mongoose.model("ContactData", contactDataSchema);
// Handle POST request for submitting contact form
app.post("/submit_contact", async (req, res) => {
  try {
    // Extract data from the request body
    const { name, email, message } = req.body;
    
    // Create a new instance of the ContactData model to store the contact message
    const newContact = new ContactData({
      name: name,
      email: email,
      message: message
    });
    
    // Save the contact message to MongoDB
    await newContact.save();

    // For demonstration purposes, let's just send a response
    res.send("Contact form submitted successfully!");

    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting contact form.");
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

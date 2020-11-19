/**
 * Entry file.
 *
 *
 * @copyright  Fran de la Rosa
 * @author     Fran de la Rosa <frandelarosadev@gmail.com>
 * @version    1.0
 */

// Create an express app
const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();

// Use the express-static middleware
app.use(express.static("public"));

// Define 'public' folder as entry point
app.use("/", express.static(path.join(__dirname, "..", "public")));

// Start server
app.listen(process.env.PORT, () => {
  console.log("Web server is running");
});

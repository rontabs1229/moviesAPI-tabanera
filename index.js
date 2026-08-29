const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require('dotenv').config();

const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("We're connected to the cloudbase database"));

// Explicit CORS options without optionsSuccessStatus
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:4000',
        'https://movieapp-tabanera.vercel.app'
    ],
    credentials: true
};

// 1. CORS Middleware MUST be placed at the top
app.use(cors(corsOptions));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Routes
app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = { app, mongoose };
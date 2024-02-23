const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors"); // Import the CORS middleware
const User = require("./models/user")
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();
const PORT = 3001;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

app.use(cors()); // Use CORS middleware to allow requests from the frontend
app.use(express.json());
app.use("/api/auth", authRoutes); // All the routes defined in auth.js will be prefixed with /api/auth

const users = [
    {"username" : "frank",
        "password" : "2002",
        "OrgName" : "Org1"},
    {"username" : "amigli",
        "password" : "2002",
        "OrgName" : "Org2"}]

const username1 = "frank"
const username2 = "amigli"
const password1 = "2002"
const password2 = "2002"
const OrgName1  ="Org1"
const OrgName2 = "Org2"

const user1 = bcrypt.genSalt(10)
    .then(
    salt =>{
        return bcrypt.hash(password1, salt)
    })
    .then(hash =>{
        return new User({
                username: username1,
                OrgName: OrgName1,
                password: hash
            }
        )
    });

const user2 = bcrypt.genSalt(10)
    .then(
        salt =>{
            return bcrypt.hash(password2, salt)
        })
    .then(hash =>{
        return new User({
                username: username2,
                OrgName: OrgName2,
                password: hash
            }
        )
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
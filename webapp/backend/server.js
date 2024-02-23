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

app.listen(PORT, () => {
    const username1 = "frank"
    const username2 = "amigli"
    const password1 = "2002"
    const password2 = "2002"
    const OrgName1  ="Org1"
    const OrgName2 = "Org2"

    bcrypt.genSalt(10)
        .then(
            salt =>{
                return bcrypt.hash(password1, salt)
            })
        .then(hash =>{
               let user1 = new User({
                    username: username1,
                    OrgName: OrgName1,
                    password: hash
                })

                user1.save()
        });

    bcrypt.genSalt(10)
        .then(
            salt =>{
                return bcrypt.hash(password2, salt)
            })
        .then(hash =>{
            let user2 = new User({
                    username: username2,
                    OrgName: OrgName2,
                    password: hash
                }
            )

            user2.save();
        });

   console.log(`Server running on port ${PORT}`);
});



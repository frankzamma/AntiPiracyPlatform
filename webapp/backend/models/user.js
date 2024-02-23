const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//definiamo lo schema per un utente
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },

    OrgName: {
        type: String,
        required: false
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});


//aggiungiamo il controllo della password per l'utente
userSchema.methods.verifyPassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
const mongoose = require('mongoose');
const moment = require('moment');
const passportLocalMongoose = require('passport-local-mongoose');
//create schema
const userSchema = mongoose.Schema({
    email: String,
    name: String,
    resetPasswordToken: String,
    timezone: String,
    bodyweight: [{ date: Date, bw: Number }],
    Exercises: [
        {
            name: String,
            repMaxHistory: [{ date: Date, max: Number }],


        }],
    routine: { name: String, block: [{}] },
    workouts: [{}]
});


userSchema.plugin(passportLocalMongoose, { usernameField: "email", usernameLowerCase: true });

module.exports = mongoose.model("User", userSchema);
const mongoose = require('mongoose');
const moment = require('moment');
const passportLocalMongoose = require('passport-local-mongoose');
//create schema
const userSchema = mongoose.Schema({
    email: String,
    name: String,
    resetPasswordToken: String,

    bodyweight: [{ date: Date, bw: Number }],
    Exercises: [
        {
            name: String,
            repMaxHistory: [{ date: Date, max: Number }],
            // maxRepsHistory: [{ date: Date, maxReps: Number}],
            
        }],
    routine: {name:String, block: [{}]},
    conditioning:[{name: String, date: Date, distance: Number, time: Number, weight: Number}],
    workouts: [{}]
});


userSchema.plugin(passportLocalMongoose, { usernameField: "email", usernameLowerCase: true });

module.exports = mongoose.model("User", userSchema);
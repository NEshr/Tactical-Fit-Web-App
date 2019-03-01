const User = require('../models/userModel');
const passport = require('passport');
const flash = require('connect-flash');
const moment = require('moment');
const schedule = require('../controllers/schedule');


exports.login = (req, res, next) => {
    return passport.authenticate('local', {

        failureFlash: "incorrect email or password",
        failureRedirect: "/auth/login",

        successRedirect: req.session.redirectTo || "/auth/profile",
        successFlash: 'Login Successful'
    })(req, res, next);
};

exports.logout = (req, res, ) => {
    req.logout();
    res.redirect('/auth/login');
};

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.originalUrl;


    res.redirect("/auth/login");
};

exports.reDirectLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/auth/profile");
    }
    next();
}

exports.register = async (req, res, next) => {
    let { name, email, password } = req.body;
    let user = new User({
        name,
        email

    });
    try {
        if (user.email.match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === null) {
            throw new Error('invalid email address');

        }
        let registeredUser = await User.register(user, password);
        await registeredUser.save();
        next();
    }
    catch (error) {


        req.flash('error', error.message);
        res.redirect('/auth/register');
    }
};



exports.loginForm = (req, res) => {
    res.render("login", { success: req.flash('success'), error: req.flash('error') });
};

exports.registerForm = (req, res) => {
    res.render("register", req.flash());
};
exports.profileForm = (req, res) => {
    let workout;
    let dateOfNextWorkout;
    if(req.user.routine.block.length !== 0){
        let workout = req.user.routine.block.find((workout)=>{ return moment(workout.dateOfWorkout).isAfter(moment(), 'day'); });
        dateOfNextWorkout = moment(workout.dateOfWorkout).format('LL');

    }
    
    let wrkoutExists = req.user.workouts.findIndex(workout => moment(workout["date"]).isSame(moment(), 'day'));
    if (wrkoutExists === -1) {
        workout = schedule.workoutOfTheDay(req.user);
    }
    else {
        workout = undefined;
    }
    res.render("profile",
        {
            username: req.user.name,
            routine: req.user.routine.name,
            workout: workout,
            successSched: req.flash('successSched'),
            successInc: req.flash('successInc'),
            errorMessage: req.flash('error'),
            successRoutine: req.flash('successRoutine'),
            nextWorkout: dateOfNextWorkout
        });
};
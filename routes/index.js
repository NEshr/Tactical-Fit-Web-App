const express = require('express');
let router = express();
let addExercise = require('../controllers/addUpdateExercise');
let setMassRoutine = require('../controllers/setRoutine');
let User = require('../models/userModel');
let authController = require('../controllers/authControllers');
let schedule = require('../controllers/schedule');
let moment = require('moment');
let momentTz = require('moment-timezone');
let formatWorkout = require('../controllers/formatWorkout');
let mailer = require('../controllers/getPassword');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator();
let uid;



router.get('/addExercise', (req, res) => {
    res.render('addExercise');
});

router.get('/getPassword', async (req, res) => {
    res.render('getPassword');
});

router.post('/getPassword', async (req, res) => {

    try {

        uid = await uidgen.generate();
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error("Error: Email not found in database");
        }
        user.resetPasswordToken = uid;
        await user.save();

        await mailer(user.email, user.resetPasswordToken);

        req.flash('success', 'Email Sent. Note: Email may be in spam folder');
        res.redirect('/auth/login');
    }
    catch (error) {
        req.flash('error', error.message);
        res.render('getPassword', { error: req.flash('error') });
    }
});

router.get('/resetPass/:uid', async (req, res) => {
    try {
        let user = await User.findOne({ resetPasswordToken: req.params.uid });

        if (user) {
            res.render('resetPass', { email: user.email });
        }
        else {
            res.redirect('/auth/login');
        }
    }
    catch (error) {
        console.log(error.message);
    }
});

router.post('/resetPass', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        user.resetPasswordToken = undefined;


        await user.setPassword(req.body.password);
        await user.save();

        req.flash('success', 'Password Reset');
        res.redirect('/auth/login');
    }
    catch (error) {
        console.log(error.message);
    }
});

router.use('/', authController.isLoggedIn);

router.get('/selectRoutine', async (req, res) => {
    res.render('routineSelector');
});

router.get('/MassRoutine', async (req, res) => {
    res.render('mass', { timezone: momentTz.tz.names(), error: req.flash('error') });
})

router.post('/MassRoutine', async (req, res) => {
    try {
        momentTz.tz.setDefault(req.body.timezone);
        let exercises = req.body;
        let array = ["push", "pull", "legs", "dl"];
        //adds or updates exercises depending on if they already exist
        for (entry of array) {
            if (exercises["weight lifted-" + entry] !== "" && exercises["reps-" + entry] !== "" || exercises["weight lifted-" + entry] === "" && exercises["reps-" + entry] !== "") {
                await addExercise(req.user, exercises[entry], exercises["weight lifted-" + entry], exercises["reps-" + entry], exercises.timezone);
            }
        }

        let startDate = req.body.date;
        let user = await User.findById(req.user._id);
        user.timezone = req.body.timezone;

        if (moment(startDate).isBefore(momentTz.tz(req.body.timezone), 'day')) {
            throw new Error('Error: Please Choose a date that is on or after today');
        }

        let push = user.Exercises.find((exercise) => { return exercise.name === req.body.push });
        let pull = user.Exercises.find((exercise) => { return exercise.name === req.body.pull });
        let legs = user.Exercises.find((exercise) => { return exercise.name === req.body.legs });
        let dl = user.Exercises.find((exercise) => { return exercise.name === req.body.dl });
        if(!(push && pull && legs && dl)){
            throw new Error ('Error: You must fill in every exercise');
        }
        let massRoutine = setMassRoutine(push, pull, legs, dl, startDate);
        user.routine.name = "Mass Routine";
        user.routine.block = massRoutine;
        await user.save();
        req.flash('successRoutine', "Successfully Created Routine!")
        res.redirect('/auth/profile')

    }
    catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/MassRoutine');
    }
})


router.get('/currentWorkout', (req, res) => {
    try {
        let todaysWorkout = schedule.workoutOfTheDay(req.user);
        let wrkoutExistsInDB;
        if (todaysWorkout !== null) {
            wrkoutExistsInDB = req.user.workouts.findIndex(workout =>
                moment(workout['date']).isSame(momentTz.tz(req.user.timezone), 'day'));
        }

        if (wrkoutExistsInDB === -1) {
            todaysWorkout = schedule.workoutOfTheDay(req.user);
            todaysWorkout.wrkoutNum = 11;
        }
        else if (wrkoutExistsInDB > -1) {
            todaysWorkout = 0;
        }
        else {
            todaysWorkout = null;
        }

        res.render('workout', { todaysWorkout, error: req.flash('error') });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/auth/profile');
    }
});

router.post('/currentWorkout', async (req, res) => { // dont forget to put functionality for repeat week
    try {
        let user = await User.findById(req.user._id);
        let workout = formatWorkout(req.body);
        user.workouts.push(workout);
        if (req.body.increment) {
            let i = 0;
            for (let lift of req.body.lift) {
                let index = user.Exercises.findIndex((exercise) => exercise.name === lift);
                if(index !== -1){
                    let exercise = user.Exercises[index].repMaxHistory;
                    exercise.push[{ date: momentTz.tz(req.user.timezone).toDate(), max: Number(exercise[exercise.length - 1].max) + Number(req.body.increment[i]) }];
                    i++;
                }
               
            }
            req.flash('successInc', "Rep Max Updated!")
        }
        if (req.body.repeatWeek === 'yes') {
            schedule.repeatWeek(user.routine.block, user.timezone);

            req.flash('successSched', "Schedule Updated!");
        }
        await user.save();
        res.redirect('/auth/profile');
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/currentWorkout');
    }

});

router.get('/exerciseHistory', (req, res) => {

    res.render('exerciseHistory', { exercises: req.user.Exercises });
});
router.post('/exerciseHistory', async (req, res) => {
    let user = await User.findById(req.user._id);

    let exercise = user.Exercises.find((element) => {
        return element.name === req.body.exercises;
    });

    res.render('exerciseHistory', { selectedExercise: exercise.repMaxHistory, moment: require('moment') });
});



module.exports = router;


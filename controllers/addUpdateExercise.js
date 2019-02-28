const User = require('../models/userModel');
const repMax = require('./1RepMaxPercentages');
const momentTz = require('moment-timezone');
const moment = require('moment');

async function addExercise(user, name, weight, reps, timezone) {

    //finds the index within the exercise array in user document if present. Returns -1 if not
    let existingExerciseIndex = user.Exercises.findIndex((exercise) => { return exercise.name === name });
    let dateAdded = momentTz.tz(timezone);
    //tests if bodyweight(as opposed to weighted) reps were performed
    if (weight !== "" && weight !== undefined) {

        //test to see if exercise already exists in user database
        if (existingExerciseIndex !== -1) {
            //finds index of repMaxHistory array within exercise object if available. Returns -1 if not.
            let existingWorkoutIndex = user.Exercises[existingExerciseIndex].repMaxHistory.findIndex((session) => { return moment(session.date).isSame(momentTz.tz(user.timezone), 'day') });
            // test to see if data for this workout session alraedy exists, implying user is attempting to update existing data
            if (existingWorkoutIndex !== -1) {
                user.Exercises[existingExerciseIndex].repMaxHistory[existingWorkoutIndex].max = repMax.calculate1RM(weight, reps);
            }
            else {
                user.Exercises[existingExerciseIndex].repMaxHistory.push({ date: dateAdded.toDate(), max: repMax.calculate1RM(weight, reps) });
            }
        }
        //if data doesn't exist, then a new entry is pushed into user database(i.e. the exercise array in user document)
        else {
            user.Exercises.push({ name: name, repMaxHistory: { date: dateAdded.toDate(), max: repMax.calculate1RM(weight, reps) } });
        }
    }

    //if bodyweight exercise used
    else {
        //again checks to see if exercise already exists in db
        if (existingExerciseIndex !== -1) {

            let existingWorkoutIndexRepMax = user.Exercises[existingExerciseIndex].repMaxHistory.findIndex((session) => { return moment(session.date).isSame(momentTz.tz(user.timezone), 'day') });

            //if workout session already exists, update info, otherwise push new workout session into repMaxHistory array
            if (existingWorkoutIndexRepMax !== -1) {
                user.Exercises[existingExerciseIndex].repMaxHistory[existingWorkoutIndexRepMax].max = reps;
            }
            else {
                user.Exercises[existingExerciseIndex].repMaxHistory.push({ date: dateAdded.toDate(), max: reps });
            }

        }
        //if exercise does not exist in database create new exercise
        else {
            user.Exercises.push({ name: name, repMaxHistory: { date: dateAdded.toDate(), max: reps } });
        }
    }
    await user.save();

}

module.exports = addExercise;
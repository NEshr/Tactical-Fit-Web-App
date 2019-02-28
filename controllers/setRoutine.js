// const workoutModel = require('../models/workoutModel');
// const exerciseModel = require('../models/exerciseModel');
let schedule = require('./schedule');
let repMax = require('../controllers/1RepMaxPercentages');
let moment = require('moment');
const User = require('../models/userModel');




// function addExercise(name, weight, reps, bwOrNot) {

//     let existingExerciseIndex = User.Exercises.findIndex((exercise) => { return exercise.name === name });
//     if (bwOrNot !== undefined) {
//         if (existingExercise !== -1) {

//             User.Exercises[existingExerciseIndex].maxRepsHistory.push({ date: Date(), maxReps: reps });
//         }
//         else {
//             User.Exercises.push({ name: name, maxRepsHistory: { date: Date(), maxReps: reps } });
//         }
//     }
//     else {
//         if (existingExercise !== -1) {
//             User.Exercises[existingExerciseIndex].repMaxHistory.push({ date: Date(), max: repMax.caculate1RM(weight, reps) });
//         }
//         else {
//             User.Exercises.push({ name: name, repMaxHistory: { date: Date(), max: repMax.caculate1RM(weight, reps) } });
//         }
//     }

// }



function setMassRoutine(push, pull, legs, dl, startDate) {

    let pushEx = { name: push.name, oneRepMax: push.repMaxHistory[push.repMaxHistory.length - 1].max };

    let pullEx = { name: pull.name, oneRepMax: pull.repMaxHistory[pull.repMaxHistory.length - 1].max };
    let legsEx = { name: legs.name, oneRepMax: legs.repMaxHistory[legs.repMaxHistory.length - 1].max };
    let dlEx = { name: dl.name, oneRepMax: dl.repMaxHistory[dl.repMaxHistory.length - 1].max };
    let wk1percentage = 65;
    let wk2percentage = 75;
    let wk3percentage = 85;

    let formattedDate = startDate.split('-');
    let date = "" + formattedDate[1] + '/' + formattedDate[2] + '/' + formattedDate[0];
    let routineSchedule = schedule.setWorkoutSchedule(date);


    let routine = [];

    let percentagesPushEx = [
        repMax.percentageOf1RM(pushEx.oneRepMax, wk1percentage),
        repMax.percentageOf1RM(pushEx.oneRepMax, wk2percentage),
        repMax.percentageOf1RM(pushEx.oneRepMax, wk3percentage)];
    let percentagesPullEx = [
        repMax.percentageOf1RM(pullEx.oneRepMax, wk1percentage),
        repMax.percentageOf1RM(pullEx.oneRepMax, wk2percentage),
        repMax.percentageOf1RM(pullEx.oneRepMax, wk3percentage)];
    let percentagesLegsEx = [
        repMax.percentageOf1RM(legsEx.oneRepMax, wk1percentage),
        repMax.percentageOf1RM(legsEx.oneRepMax, wk2percentage),
        repMax.percentageOf1RM(legsEx.oneRepMax, wk3percentage)];

    let percentagesDlEx = [
        repMax.percentageOf1RM(dlEx.oneRepMax, wk1percentage),
        repMax.percentageOf1RM(dlEx.oneRepMax, wk2percentage),
        repMax.percentageOf1RM(dlEx.oneRepMax, wk3percentage),

    ];

    let k = 0;
    for (let i = 0; i < 12; i++) {


        if (i === 3) {
            routine.push({
                wrkoutNum: i,
                workout: {
                    exercise4: { name: dlEx.name, reps: 6, sets: 4, prescribedWeightOrReps: percentagesDlEx[k] },

                },
                dateOfWorkout: routineSchedule.all[i].toDate()
            });
            continue;
        }
        else if (i > 3 && i < 7) {
            k = 1;
        }
        else if (i === 7) {
            routine.push({
                wrkoutNum: i,
                workout: {
                    exercise4: { name: dlEx.name, reps: 5, sets: 4, prescribedWeightOrReps: percentagesDlEx[k] },

                },
                dateOfWorkout: routineSchedule.all[i].toDate()
            });
            continue;
        }
        else if (i > 7 && i < 11) {
            k = 2;
        }
        else if (i === 11) {
            routine.push({
                wrkoutNum: i,
                wrkout: {
                    exercise4: { name: dlEx.name, reps: 4, sets: 4, prescribedWeightOrReps: percentagesDlEx[k] },

                },
                dateOfWorkout: routineSchedule.all[i].toDate()
            });
            continue;
        }
        routine.push({
            wrkoutNum: i,
            workout: {
                exercise1: { name: pushEx.name, reps: 8, sets: 4, prescribedWeightOrReps: percentagesPushEx[k] },
                exercise2: { name: pullEx.name, reps: 8, sets: 4, prescribedWeightOrReps: percentagesPullEx[k] },
                exercise3: { name: legsEx.name, reps: 8, sets: 4, prescribedWeightOrReps: percentagesLegsEx[k] },

            },
            dateOfWorkout: routineSchedule.all[i].toDate()
        });
    }

    return routine;

}

// setMassRoutine(pushEx, pullEx, legsEx, dlEx, "1/16/2019");

module.exports = setMassRoutine;
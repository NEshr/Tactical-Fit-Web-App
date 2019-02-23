let moment = require('moment');
let mongoose = require('mongoose');
let User = require('../models/userModel');



function setWorkoutSchedule(firstDay) { //firstDay will be a date in format MM/DD/YYYY which is 'L' format in moment.js

    let session1 = moment(firstDay, 'L');

    // let todaysDate = moment();
    // if (session1.isBefore(todaysDate, 'day')) {
    //     return Error('error: please use a date that is on or after today');
    // }

    let week1 = [session1, session1.clone().add(2, 'days'), session1.clone().add(4, 'days'), session1.clone().add(5, 'days')];
    let week2 = week1.map(session => session.clone().add(1, 'weeks'));
    let week3 = week2.map(session => session.clone().add(1, 'weeks'));
    let allWeeks = week1.concat(week2).concat(week3);

    let routineSchedule = {
        wk1: week1,
        wk2: week2,
        wk3: week3,
        all: allWeeks
    };

    return routineSchedule;

}

// function isTodayaWorkoutDay(routineSchedule) {

//     let workoutWeeks = Object.values(routineSchedule);
//     let dateToday = moment();
//     console.log(dateToday.utcOffset());

//     for (let i = 0; i < workoutWeeks.length; i++) {
//         let workoutWk = workoutWeeks[i];

//         for (let k = 0; k < workoutWk.length; k++) {
//             let workoutDay = workoutWk[k];
//             if (dateToday.isSame(workoutDay, 'day')) {
//                 return console.log('today is a workoutday');
//             }
//         }

//     }

//     return console.log('today is not a workout day');
// }
function workoutOfTheDay(user) {

    for (let i = 0; i < user.routine.block.length; i++) {
        if (moment(user.routine.block[i].dateOfWorkout).isSame(moment(), 'day')) {
            return user.routine.block[i];
        }
    }
    return null;
}


function repeatWeek(routine) {
    let today = moment();
    let workout = routine.find((workout) => { return moment(workout["dateOfWorkout"]).isAfter(today, 'day') });
    let workoutIndex = 6;
    // workout.wrkoutNum - 1;

    if (workoutIndex <= 3) {
        for (let workout of routine) {
            if (workout.wrkoutNum > 3) {
                workout.dateOfWorkout = moment(workout.dateOfWorkout).add(1, 'weeks').toDate();
            }
        } 
    }
    else if (workoutIndex > 3 && workoutIndex <= 7) {
        for (let workout of routine) {
            if (workout.wrkoutNum > 3) {
                workout.dateOfWorkout = moment(workout.dateOfWorkout).add(1, 'weeks').toDate();
            }
        }
    }
    else {
        for (let workout of routine) {
            if (workout.wrkoutNum > 7) {
                workout.dateOfWorkout = moment(workout.dateOfWorkout).add(1, 'weeks').toDate();
            }
        }
    }
} 



module.exports = { setWorkoutSchedule, workoutOfTheDay, repeatWeek };


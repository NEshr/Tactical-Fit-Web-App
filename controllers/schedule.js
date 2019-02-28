let moment = require('moment');
let momentTz = require('moment-timezone');
let mongoose = require('mongoose');
let User = require('../models/userModel');



function setWorkoutSchedule(firstDay) { //firstDay will be a date in format MM/DD/YYYY which is 'L' format in moment.js

    let session1 = moment(firstDay, 'L');

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

function workoutOfTheDay(user) {

    for (let i = 0; i < user.routine.block.length; i++) {
        if (moment(user.routine.block[i].dateOfWorkout).isSame(momentTz.tz(user.timezone), 'day')) {
            return user.routine.block[i];
        }
    }
    return null;
}


function repeatWeek(routine, timezone) {
    let today = momentTz.tz(timezone);
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


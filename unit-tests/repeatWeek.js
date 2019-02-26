const moment = require('moment');
const momentTz = require('moment-timezone');
function repeatWeek(routine) {
    let today = momentTz.tz("US/Central");
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


module.exports=repeatWeek;
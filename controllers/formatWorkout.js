const moment = require('moment');

function formatWorkout(wrkoutInfo) {

    let exercises = wrkoutInfo.lift;
    let reps = wrkoutInfo.reps;
    let sets = wrkoutInfo.sets;
    let weightRepLog = wrkoutInfo["weightOrReps"];

    let date = moment(wrkoutInfo.date).toDate();
    let workout = {};
    workout["date"] = date;
    for (let i = 0; i < exercises.length; i++) {
        workout[exercises[i]] = { "weightOrReps": weightRepLog[i] };
    }
    let i = 0;
    workout[exercises[i]]['sets'] = [];
    workout[exercises[i]]['sets'].push(reps[i]);
    for (let k = 1; k < sets.length; k++) {

        if (sets[k] == 1) {
            i++;
            workout[exercises[i]]['sets'] = [];
            workout[exercises[i]]['sets'].push(reps[k]);
        }
        else {
            workout[exercises[i]]['sets'].push(reps[k]);
        }

    }

    return workout;
}



// formatWorkout(["bench press", "high bar squat", "squat"], [1,2,3,1,2,3,1], [3,2,3,4,5,5]);

module.exports = formatWorkout;
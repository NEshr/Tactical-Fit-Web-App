function calculate1RM(weight, reps) {
    let oneRM = Math.round(weight * (36 / (37 - reps)));

    return oneRM;
};

/*The funciton below assumes weights go by increment of 5lbs, the standard in most U.S. gyms. 
Hence it will round the I/O to conform to that. For example, 127.5 lbs will round up to 130 lbs. 
*/
function percentageOf1RM(percentage, oneRepMax) {

    let percentOf1RM = Math.round((percentage / 100) * oneRepMax);
    let percentAsArray = Array.from(String(percentOf1RM), Number);
    let lastDigit = percentAsArray[percentAsArray.length - 1];

    //if the number ends in > 7, round up; if between 7 and 5, round down; between 5 and 3, round up, < 3, round down
    if (lastDigit > 7) percentOf1RM += (10 - lastDigit);

    else if (lastDigit <= 7 && lastDigit > 5) percentOf1RM -= (lastDigit - 5);

    else if (lastDigit < 5 && lastDigit >= 3) percentOf1RM += (5 - lastDigit);

    else if (lastDigit < 3 && lastDigit > 0) percentOf1RM -= (lastDigit);

    return percentOf1RM;
}



module.exports = { percentageOf1RM, calculate1RM };
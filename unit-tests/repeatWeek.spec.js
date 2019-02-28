const assert = require('assert');
const repeatWeek = require('./repeatWeek');
const User = require('../models/userModel');
const moment = require('moment');
const mongodb = require('../mongo.db.utils');

before((done) => {
    mongodb.createEventListeners();
    mongodb.connect();
    done();
});


it("Should Retrieve Correct User", async function () {
    let user = await User.findOne({ email: "eshragh.nima@gmail.com" });
    assert.strictEqual(user.email, "eshragh.nima@gmail.com");
});

it("Should Update Schedule Properly", async () => {

    let user = await User.findOne({ email: "eshragh.nima@gmail.com" });
    let schedule = [];
    user.routine.block.forEach((day) => schedule.push(day.dateOfWorkout));
    repeatWeek(user.routine.block);
    await user.save();
    for (let i = 4; i < schedule.length; i++) {
        schedule[i] = moment(schedule[i]).add(1, 'weeks').toDate();
    }
    let updatedSched = [];
    user.routine.block.forEach((day) => updatedSched.push(day.dateOfWorkout));
    assert.deepEqual(schedule, updatedSched);

}).timeout(5000);

after((done) => {
    mongodb.disconnect();
    done();
})
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
function createEventListeners(){

    mongoose.connection.once("connected", ()=>{
        console.log("connected");
    });
    mongoose.connection.on("error", ()=>{
        console.log('error connecting');
    })
   
}

function connect(){
    let mongoUrl = process.env.MYAPP_MONGO_URL || "mongodb://localhost/FitWebApp";
    
    mongoose.connect(mongoUrl, { useNewUrlParser: true});
}

function disconnect(){
    mongoose.disconnect();
}

module.exports = {
    createEventListeners, connect, disconnect,
}
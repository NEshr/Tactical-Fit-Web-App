const express = require('express');
const routes = require('./routes');
const session = require('express-session');
const authRoutes = require('./routes/auth-routes');
const mongodb = require('./mongo.db.utils');
const passport = require('passport');
const app = express();
const User = require('./models/userModel');
const flash = require('connect-flash');
var favicon = require('serve-favicon')
var path = require('path')

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/', express.static('public'))
mongodb.createEventListeners();
mongodb.connect();

app.set('view engine', 'pug');
// app.use( function(req, res, next) {

//     if (req.originalUrl === 'favicon.ico' || req.originalUrl.split('/').includes('favicon')  ) {
//       return res.sendStatus(204);
//     }
  
//     return next();
  
//   });
app.use(express.json());
app.use(express.urlencoded({extended: true}));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({secret: "bananas", saveUninitialized: false, resave: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res)=>{
    res.render('home');
});

app.use('/auth', authRoutes);
app.use('/', routes);



app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('something broke');
});

app.listen(process.env.PORT || 3001, ()=>{
    
    console.log('listening...');
    console.log(process.env.PORT);
});



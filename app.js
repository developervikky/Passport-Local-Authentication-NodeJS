const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const app = new express();
const User = require('./models/User');
var flash = require('connect-flash');

require('./middlewares/passport')(passport);
mongoose.connect('mongodb://localhost:27017/passport-local-authentication', {useNewUrlParser:true,useUnifiedTopology:true},function (err, db) {
  if (err) throw err;
  if (!err) console.log('Database connected successfully...passport-local-authentication')
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static('public'));

//middlewres
app.use(flash())
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
 // cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());

const authorization = (req,res,next) => {
    if(!req.user){ //authorization falied
        res.redirect('/signin');
    }else{
        next();
    }
}

app.get('/', function(req, res){
    console.log(req.user)
    res.render('index', { message: req.flash('info') });
});
  
app.get('/flash', function(req, res){
 req.flash('info', 'Hi there!')
 res.redirect('/');
});

app.get('/signin',function(req, res){
    console.log(req.user);
    !req.user ? res.render('signin'):res.redirect('/secret-page/' + req.user.username);
});

app.post('/signin',passport.authenticate('local', { failureRedirect: '/signin' }),function(req, res) {
    res.redirect('/secret-page/' + req.user.username);
});

app.get('/signup',function(req, res){
    !req.user ? res.render('signup'):res.redirect('/secret-page/' + req.user.username);
});

app.post('/user-registration',async function(req,res){
    try {
        const newUser = new User(req.body);
        let saveUser = await newUser.save(); //when fail its goes to catch
        req.flash('success', 'User registered successfully...')
        res.redirect('/');
      } catch (err) {
        console.log('err' + err);
        res.status(500).send(err);
      }
});

app.get('/secret-page/:email?',authorization,function(req, res){
    res.render('secret',{user:req.user});
});

app.get('/sign-out', function(req, res) {
    req.logOut();
    res.redirect('/');
})

module.exports = app;
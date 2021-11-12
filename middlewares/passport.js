const LocalStrategy = require('passport-local');
const User = require('../models/User');
module.exports = function(passport){
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        //console.log(`user `+user);
        return done(null, user);
      });
    }
  ));

passport.serializeUser(function(user, done) {
    // console.log(`serializeUser -> ${user.id}`)
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
//   console.log(`deserializeUser -> ${id}`)
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
}
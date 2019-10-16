// load all the things we need
var Strategy = require('passport-local').Strategy;
var user = {
    username: 'foo',
    id: 0,
    password: '123'
};
module.exports = function(passport) {     
    // using the local strategy with passport
    passport.use('local-signup', new Strategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : false // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(email, password, cb) {
        console.log(email,password,"hi");
    //    if (email)
    //        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
        console.log("succesfully created accont");
        return cb(null, user);
    }));
    passport.use('local-login',new Strategy({
                // using custom field names
                usernameField: 'user',
                passwordField: 'pass'
            },
            // login method
            function (username, password, cb) {
                if (username === user.username && password.toString() === user.password) {
                    console.log("valid user");
                    return cb(null, user);
                }
                // null and false for all other cases
                return cb(null, false);
            }
        )
    );
    
    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });
    
    passport.deserializeUser(function (id, cb) {
    
        cb(null, user);
    
    });
};

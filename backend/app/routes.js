module.exports = function(app, passport) {
    app.get('/', function (req, res) {
        res.render('index', {
            layout: 'home',
            user: req.user
        });
    });
    app.post('/dystans',function (req, res, next) {
        if (req.isAuthenticated()) {
            console.log(req.body)
            console.log("logged");
            //???
            res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        }
        else
        res.redirect('/login');
    });
    app.get('/dystans',function (req, res) {
        res.render('index', {
            layout: 'dystans',
            user: req.user
        });
    });

    // LOGIN ==============================
    app.get('/login',
        function (req, res) {
        res.render('index', {
            layout: 'login',
            user: req.user
        });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : false // allow flash messages
    }));
    // PROFILE ==============================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('index', {
            layout: 'profile',
            user : req.user
        });
    });
    // SIGNUP ==============================
    app.get('/signup', function(req, res) {
        res.render('index',{
            layout: 'signup'
        });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : false // allow flash messages
    }));

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
}
var express = require("express");
var passport = require("passport");
var Strategy = require('passport-local').Strategy;


const app = express()
const port = 3000

//app.get('/', (req, res) => res.send('Hello World!'))

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
//app.post('/login', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login' }));


// my not so secret secret
var secret = 'eeeek',
 
// the single user record that is hard
// coded in for the sake of this simple demo
user = {
    username: 'foo',
    id: 0,
    password: '123'
};
// using ejs for rendering
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
 
// using body parser to parse the body of incoming post requests
app.use(require('body-parser').urlencoded({
    extended: true // must give a value for extended
}));
 
// using express-session for session cookies
app.use(
 
    require('express-session')(
 
        {
            name: 'site_cookie',
            secret: secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
 
                // make session cookies only last 15 seconds
                // for the sake of this demo
                maxAge: 15000
 
            }
        }
 
    )
 
);
 
// using the local strategy with passport
passport.use(
 
    // calling the constructor given by passport-local
    new Strategy(
 
        // options for passport local
        {
 
            // using custom field names
            usernameField: 'user',
            passwordField: 'pass'
 
        },
 
        // login method
        function (username, password, cb) {
 
            if (username === user.username && password.toString() === user.password) {
 
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
 
app.use(passport.initialize());
app.use(passport.session());
 
app.get('/', function (req, res) {
 
    res.render('index', {
        layout: 'home',
        user: req.user
    });
 
});
 
app.get('/login',
 
    function (req, res) {
    res.render('index', {
        layout: 'login',
        user: req.user
    });
});
/*
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.get('/server', ensureAuthenticated, routes.server.get);
app.get('/login', routes.login.get);
*/
app.post('/dystans',function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.body)
        console.log("logged");    
        
        //res.sendStatus(200);
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
    
 
    // end up at / if login works
    
app.post('/login',
    passport.authenticate('local', {
        // redirect back to /login
        // if login fails
        failureRedirect: '/login'
    }),
 
    // end up at / if login works
    function (req, res) {
        res.redirect('/');
    }
);
 
app.get('/logout',
    function (req, res) {
    req.logout();
    res.redirect('/');
});
 
app.listen(port, function () {
 
    console.log('passport-local demo up on port: ' + port);
 
});
app.get('/login',
 
    function (req, res) {
    res.render('index', {
        layout: 'login',
        user: req.user
    });
});
///****************** */
var fs = require('fs');
//
var traces,
    isVisited ={};

/**
 *Making array containing visited stops and distance to Start 
 * @param {obj} parsed file
 */
function prepareIsVisitedArray(json_file){
    for (var k =0;k<json_file.nodes.length;k++){
        isVisited[json_file.nodes[k].id]={"isVisited":false,"value":undefined};
    }
    return;
}

/**
 * making traces bi-directional 
 * @param {obj} parsed file
 * @returns {null}
 */
function makeBidirectional(json_file){
    traces = json_file["links"];
    let len = traces.length;
    for(var i=0;i<len;i++){
        let el = traces[i];
        traces.push({"distance":el.distance,"source": el.target,"target": el.source
        });
    }
    return null;
}
/**
 * Initialize .json file
 * @param {string} filename name of the .json file
 */
function Init(filename){
    //solvro_city.json
    let f = fs.readFileSync(filename,"utf-8");
    var json_file = JSON.parse(f);
    prepareIsVisitedArray(json_file);
    makeBidirectional(json_file);
}

/** 
 * Define begining stop
 * @param {string} start id of the starting stop  
 * @returns {number} if everything ok returns 0 else 1
*/
function initializeDistances(start){
    for(var i=0;i<traces.length;i++){
        if(traces[i].source == start){
            isVisited[traces[i].target].value = traces[i].distance;
        }
    }
    if(markAsVisited(start)){
        return 1;
    }
    else return 0;
}
/**
 * Searching through traces array to find the shortest distance to next stop 
* @param {string} start type: string id of the starting stop  
*/
function findDistances(target){
    var previousDistace = isVisited[target].value;
    for(var i=0;i<traces.length;i++){
        var found = traces[i];
        if(found.source == target){
            let distanceToStart = isVisited[found.target].value;
            let measuredDistance = found.distance + previousDistace;
            //console.log(distanceToStart,measuredDistance);
            if(distanceToStart == undefined || (distanceToStart > measuredDistance)){
                isVisited[found.target].value = measuredDistance;
            }
        }
    }
    markAsVisited(target);
}
/**
 * 
 * @param {string} target marking as visited in isVisited array
 * @returns {number} retuns 1 
 */
function markAsVisited(target){
    isVisited[target].isVisited = true;
    return 1;
}

/**
 * @returns {string} id of the next city to 'visit'|false if thre is no city left
 */
function chooseSubTarget(){
    for(k in isVisited){
        if(isVisited[k].isVisited == false && isVisited[k].value != undefined){
            isVisited[k].isVisited=true;
            return k

        }
    }
    return false;
}

/**
 * 
 * @param {string} Start id of first element to measure from
 * @returns {Array} list of distances between Start and all stops
 */
function measureAllDistances(start){
    initializeDistances(start);
    var nextCity = chooseSubTarget() ;
    while(nextCity){
        findDistances(nextCity);
        nextCity =chooseSubTarget()
    }
    return isVisited;
}
Init("solvro_city.json")
measureAllDistances("5");

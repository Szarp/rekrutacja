const distance = require('./measureDistance.js');
distance.loadFile('solvro_city1.json');

module.exports = function(app, passport) {
    /**
   * @swagger
   * /:
   *   get:
   *     description: Returns the homepage
   *     responses:
   *       200:
   *         description: hello world
   */
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
    /**
   * @swagger
   * /login:
   *   get:
   *     description: Place to login
   *     responses:
   *       200:
   *         description: retruns the login page
   */
    app.get('/login',
        function (req, res) {
        res.render('index', {
            layout: 'login',
            user: req.user
        });
    });
    /**
   * @swagger
   * /login:
   *   post:
   *     description: Authentication the form with user credentials
   *     parameters:
   *        - in: query
   *          name: user
   *          required: true
   *          schema:
   *            type: string
   *          description: Stop where the path begins
   *        - in: query
   *          name: pass
   *          required: true
   *          schema:
   *            type: string
   *          description: Stop where the path ends
   *     responses:
   *       200:
   *         description: Redirect to /profile if succesfully logged
   */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : false // allow flash messages
    }));
    // PROFILE ==============================
    /**
   * @swagger
   * /profile:
   *   get:
   *     description: Profile page for logged users
   *     responses:
   *       200:
   *         description: Redirect to /profile if user is logged; to /login
   */
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('index', {
            layout: 'profile',
            user : req.user
        });
    });
    // SIGNUP ==============================
    /**
   * @swagger
   * /signup:
   *   get:
   *     description: Form to creating new accont
   *     responses:
   *       200:
   *         description: Page with form to login
   */
    app.get('/signup', function(req, res) {
        res.render('index',{
            layout: 'signup'
        });
    });
    /**
   * @swagger
   * /signup:
   *   post:
   *     description: Process signup request
   *     parameters:
   *       - in: query
   *         name: user
   *         required: true
   *         schema:
   *           type: string
   *         description: Stop where the path begins
   *       - in: query
   *         name: pass
   *         required: true
   *         schema:
   *           type: string
   *         description: Stop where the path ends
   *     responses:
   *       200:
   *         description: Redirect to /profile if user is logged; to /signup if not
   */
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : false // allow flash messages
    }));

    // LOGOUT ==============================
    /**
   * @swagger
   * /logout:
   *   get:
   *     description: Logout the user
   *     responses:
   *       200:
   *         description: Redirect /home
   */
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    /**
     * @swagger
     * /stops:
     *  get:
     *      description: Returns list of stops in Solvro City.
     *      responses:
     *          200:
     *              description: JSON array of checklists' names.
     *              content:
     *                  application/json:
     *              schema:
     *                  type: object
     *              example: {
     *                  "stops": [
     *                  {
     *                      "name": "Przystanek 1"
     *                 },
     *                  {
     *                      "name": "Przystanek 2"
     *                 }
     *                  ]
     *              }
     */
    app.get('/stops', function(req, res) {
        console.log(distance.cityNames());
        res.send(distance.cityNames());
        //res.redirect('/');
    });
    /**
     * @swagger
     * /path:
     *   get:
     *       descripton: Returns list of stops in path and total distance.
     *       parameters:
     *          - in: query
     *            name: source
     *            required: true
     *            schema:
     *              type: string
     *            description: Stop where the path begins
     *          - in: query
     *            name: target
     *            required: true
     *            schema:
     *              type: string
     *            description: Stop where the path ends
     *       responses:
     *           200:
     *               description: JSON containing stops and total distance.
     *               content:
     *                   application/json:
     *               schema:
     *                   type: object
     *               example: {
     *                   "stops": [
     *                   {
     *                       "name": "Przystanek 1"
     *                   },
     *                   {
     *                       "name": "Przystanek 2"
     *                   }
     *                   ],
     *                   "distance": 12
     *               }
    */
    app.get('/path', function(req, res) {
        //console.log(distance.distById("1","2"));
        var params = req.query,
            s = params["source"],
            t = params["target"];
        if(s && t){
            //distance.initializeDistances(s)
            //console.log(distance.distById(s,t));
            res.send(distance.distById(s,t));
        }
        else{
            console.log("no parameters");
            res.send("no parameters")
        }
        //console.log(req.query);
        //res.send(distance.distById("0","0"))
        //res.redirect('/');
        //res.send("ok");
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/login');
    }
}
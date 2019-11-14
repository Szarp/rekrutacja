const distance = require('./measureDistance.js');
distance.loadFile('solvro_city.json');

module.exports = function (app, passport) {
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
   *          description: Username
   *        - in: query
   *          name: pass
   *          required: true
   *          schema:
   *            type: string
   *          description: password
   *     responses:
   *       200:
   *         description: Succesful login
   *       401:
   *         description: Can't login
   * */
    app.post('/login', function(req, res,next) {
        passport.authenticate('local-login',function(err,user){
            if (!user) {
                return res.status(401).json({message:"Invalid credentials"});
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                    return res.status(200).json({message:"Nice to see you"});
            });

        })(req,res,next);
    });
    // PROFILE ==============================
    /**
   * @swagger
   * /profile:
   *   get:
   *     description: Profile page for logged users
   *     responses:
   *       200:
   *         description: redirect to /profile
   *
   * */
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('index', {
            layout: 'profile',
            user: req.user
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
    app.get('/signup', function (req, res) {
        res.render('index', {
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
   *         description: username
   *       - in: query
   *         name: pass
   *         required: true
   *         schema:
   *           type: string
   *         description: password
   *     responses:
   *       200:
   *         description: Succesful signup
   *       401:
   *         description: Invalid name
   */
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup',function(err,user){
            if (!user) {
                return res.status(401).json({message:"There is an user with same nickname, please change it"});
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                    return res.status(200).json({message:"Nice to see you"});
            });

        })(req,res,next);
    });

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
    app.get('/logout', function (req, res) {
        req.logout();
        res.status(200).json({
            "message": 'See you soon'
        });
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
     */
    app.get('/stops', function (req, res) {
        res.send(distance.cityNames());
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
     *           401:
     *               description: Invalid stops; can't measure distance
     *               content:
     *                   application/json:
     *               schema:
     *                   type: object
     */
    app.get('/path', function (req, res) {
        var params = req.query,
            s = params["source"],
            t = params["target"];
        if (s && t) {
            res.send(distance.distById(s, t));
        }
        else {
            res.status(401).json({
                "message": 'no parameters'
            });
        }
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.status(401).json({
            "message": 'You\'re not logged'
        });
    }
}
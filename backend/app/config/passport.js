var bcrypt   = require('bcrypt-nodejs');
var Strategy = require('passport-local').Strategy;
var fs = require('fs');

let users = fs.readFileSync('./app/config/userList1.json',"utf-8");
users = JSON.parse(users);
var allUsers = users.all_users;
var userList = users.user_list;

module.exports = function(passport) {
    /**
     * LocalStrategy for signup
     */
    passport.use('local-signup', new Strategy({
        usernameField : 'user',
        passwordField : 'pass'
    },
    function (username, password, cb) {
        console.log(username,password,"hi");
        let index = userList.indexOf(username);
                let validUser = false;
                if(index == -1){
                    let hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                    let userObj = {"username":username,"hash_password":hash,"id":allUsers.length};
                    addUserToFile(userObj);
                    return cb(null, userObj.id);
                    //console.log(userObj);
                }
                else{
                    console.log("There is an user with same nickname, please change it");
                }
                return cb(null, false);
        return cb(null, false);
    }));
    /**
     * LocalStrategy for login
     */
    passport.use('local-login',new Strategy({
                // using custom field names
                usernameField: 'user',
                passwordField: 'pass'
            },
            // login method
            function (username, password, cb) {
                let index = userList.indexOf(username);
                let validUser = false;
                if(index != -1){
                    if(bcrypt.compareSync(password, allUsers[index].hash_password)){
                        return cb(null, allUsers[index]);
                    }
                }
                return cb(null, false);
            }
        )
    );
    passport.serializeUser(function (id, cb) {
        cb(null, id);
    });
    passport.deserializeUser(function (id, cb) {
        cb(null, id);
    });
    /**
     * Function to add user to list and save to file
     * @param {object} userObj object containg {username:,hash_password_id}
     */
    function addUserToFile(userObj){
        users.all_users.push(userObj);
        users.user_list.push(userObj.username);
        fs.writeFileSync('./app/config/userList1.json',JSON.stringify(users),"utf-8");
        return true;

    }
};

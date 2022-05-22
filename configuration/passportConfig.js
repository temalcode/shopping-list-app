
const passport = require('passport')
const localstrategy = require('passport-local').Strategy
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

async function initialize(username, password, done) {

    try{
        let userProfile = await userModel.findOne({username: username})
        if(!userProfile){
            console.log('username not found');
            return done(null, false)
        }
        let isPasswordCorrect = await bcrypt.compare(password, userProfile.password)
        if(!isPasswordCorrect){
            console.log('password incorrect');
            return done(null, false)
        } else{
            return done(null, userProfile)
        }
    } catch(err){
        done(err)
    }
}


let ppStategy = new localstrategy(initialize)

passport.use(ppStategy)

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((userId, done) => {
    userModel.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});



module.exports = initialize
const User = require('./models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./config.js');


exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600*60 });
}

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
}

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));


exports.verifyUser = passport.authenticate('jwt', { session: false });
exports.verifyAdmin =  (req, res, next) => {
        if (req.user && req.user.admin)
            next();
        else {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            next(err);
        }
    };
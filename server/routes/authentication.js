const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const models = require("../models").default;
const { ForbiddenError } = require("../errors");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "tempSecret";
opts.passReqToCallback = true;

// Authentication for routes where paramId must equal user Id in token
passport.use(
    "jwt-param-id",
    new JwtStrategy(opts, (req, jwt_payload, done) => {
        if (!paramIdMatchesPayloadId(req.params.userId, jwt_payload.id)) {
            return done(new ForbiddenError(), false);
        }
        models.User.findOne({ where: { id: jwt_payload.id } })
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, false);
            });
    })
);

passport.use(
    "jwt",
    new JwtStrategy(opts, (req, jwt_payload, done) => {
        let id = req.params.userId || jwt_payload.id;
        models.User.findOne({ where: { id } })
            .then(user => {
                if (user) return done(null, user);
                done(`User with id of '${id}' does not exist`, false);
            })
            .catch(err => {
                done(err, false);
            });
    })
);

export default passport;

function paramIdMatchesPayloadId(paramId, payloadId) {
    return Number.parseInt(paramId) == Number.parseInt(payloadId);
}

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async function (jwt_payload, done) {
            //得到token后鉴权,并解析
            // { id: '5c28a0c893b47463f87d4a78',
            //   name: '018',
            //   iat: 1546483850,
            //   exp: 1546487450 }
            // console.log(jwt_payload);

              const user = await User.findById(jwt_payload.id);
              if (user) {
                return done(null, user);
              } else {
                return done(null, false);
              }
        })
    );
};
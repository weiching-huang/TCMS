import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user-model.js";
export default (passport) => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PASSPORT_SECRET,
    };
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload._id);
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }
    }));
};
//# sourceMappingURL=passport.js.map
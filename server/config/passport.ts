import type { PassportStatic } from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import type { StrategyOptions } from "passport-jwt";
import User from "../models/user-model.js";

interface JwtPayload {
  _id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export default (passport: PassportStatic) => {
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PASSPORT_SECRET as string,
  };

  passport.use(
    new JwtStrategy(opts, async (jwt_payload: JwtPayload, done) => {
      try {
        const user = await User.findById(jwt_payload._id);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

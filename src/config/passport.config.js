import passport from "passport";
import local from "passport-local";
import UserManager from "../dao/managers/dbManagers/user.manager.js";
import userModel from "../dao/models/user.models.js";
import GithubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    const userManager = new UserManager();
    passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: true },
        async (req, username, password, done) => {
            try {   
                const user = await userManager.loginUser(req.body);
                if (user === "User not found") {
                    return done(null, false, { message: "User not found" });
                } else if (user === "Incorrect password") {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    passport.use("register", new LocalStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                let user = await userManager.createUser(req.body);
                if (user === "User already exists") {
                    return done(null, false, { message: "User already exists" });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
    passport.use(new GithubStrategy({
        clientID: "448a7a8c190316d8842e",
        clientSecret: "e194960a807c3ada3596d6d9b31a967ea52b147a",
        callbackURL: "/api/v1/session/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user);
            } else {
                user = await userModel.create({
                    firstName: profile._json.name,
                    lastName: "",
                    age: 0,
                    email: profile._json?.email,
                    password: "",
                    role: "user",
                }); 
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
    ));


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById({ _id: id });;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

export default initializePassport;
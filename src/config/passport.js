import passport from "passport";
import local from "passport-local";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { isValidPassword } from "../utils.js";
import config from "./config.js";
import { usersService, cartsService } from "../repositories/index.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const admin = {
    _id: "123",
    first_name: "Admin",
    last_name: "Coder",
    email: config.adminName,
    age: null,
    password: config.adminPassword,
    role: "admin"
}

const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body
        try {
            const userExist = await usersService.getUserByEmail(email);
            if (username === admin.email || userExist) return done(null, false, { message: "User exist" });
            const cart = await cartsService.createCart();
            const cartToSave = cart._id;
            const user = await usersService.createUser(first_name, last_name, email, age, password, cartToSave, [], role);
            done(null, user);
        } catch (error) {
            throw done(error);
        }
    }
    ));

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            if (username === admin.email && password === admin.password) {
                const user = admin;
                return done(null, user);
            }
            const user = await usersService.getUserByEmail(username);
            if (!user) {
                return done(null, false, { message: "User doesn't exist" });
            }
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            throw done(error);
        }
    }))
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.81081089c45b38d4",
        clientSecret: "07e1bf386ed8a0c2dc85046c3f8ce459d55a64d6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await usersService.getUserByEmail(profile._json.email);
            if (!user) {
                const cart = await cartsService.createCart();
                const cartToSave = cart.id;
                const { name, email } = profile._json;
                const user = await usersService.createUser(name, "", email, null, cartToSave, "", new Date().toString());
                done(null, user);
            } else {
                done(null, user);
            }
        } catch (error) {
            throw done(error);
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwtSecret
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getUserById(id);
        done(null, user);
    })
}

const cookieExtractor = (req) => {
    let token;
    if (req && req.cookies) return token = req.cookies['token'];
}

export default initializePassport;
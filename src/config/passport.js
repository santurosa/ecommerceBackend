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
    email: config.admin.NAME,
    age: null,
    password: config.admin.PASSWORD,
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
            if (!user) return done(null, false, { message: "User doesn't exist" });
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            throw done(error);
        }
    }))
    passport.use("github", new GitHubStrategy({
        clientID: config.github.CLIENT_ID,
        clientSecret: config.github.CLIENT_SECRET,
        callbackURL: config.github.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = !profile._json.email ? `${profile._json.login}@github.register.com` : profile._json.email;
            const user = await usersService.getUserByEmail(email);
            if (!user) {
                const cart = await cartsService.createCart();
                const cartToSave = cart.id;
                const name = profile._json.login;
                const user = await usersService.createUser(name, "", email, 99, "", cartToSave, []);
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
        secretOrKey: config.jwt.JWT_SECRET
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
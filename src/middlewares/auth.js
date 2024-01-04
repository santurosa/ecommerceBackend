import passport from "passport";

export const viewAccess = (access) => {
    return (req, res, next) => {
        passport.authenticate('jwt', function (err, user) {
            if (user) req.user = user;
            if (access === 'PUBLIC' && req.user) return res.redirect("/products");
            if (access === 'PRIVATE' && !req.user) return res.redirect("/login");
            if (access === 'ADMIN' && (!req.user || req.user.role != 'admin')) return res.redirect("/login");
            next();
        })(req, res, next)
    }
}

export const applyPolicy = (rols) => {
    return async (req, res, next) => {
        if (rols[0].toUpperCase() === "PUBLIC") return next();
        passport.authenticate('jwt', function (err, user, info) {
            if (err) return next(err);
            if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            req.user = user;
            if (!rols.includes(req.user.role.toUpperCase())) return res.status(403).send({ status: 'error', error: 'Usuario no autorizado' });
            next();
        })(req, res, next)
    }
}
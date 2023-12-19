import config from "../config/config.js";

export const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect("/products");
    next();
}

export const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

export const swaggerSession = (req, res, next) => {
    req.session.user = {
        email: 'prueba@apidocument.com',
        role: config.roleDocument,
    };
    next();
};

export const applyPolicy = (roles) => {
    return (req, res, next) => {
        if (roles[0].toUpperCase() === "PUBLIC" || req.session.user.role === config.roleDocument) return next();
        if (!req.session.user) return res.status(401).send({ status: 'error', error: 'Usuario no autenticado' });
        if (!roles.includes(req.session.user.role.toUpperCase())) return res.status(403).send({ status: 'error', error: 'Usuario no autorizado' });
        next();
    }
}
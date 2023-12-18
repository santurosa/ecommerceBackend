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

export const applyPolicy = (roles) => {
    return (req, res, next) => {
        if (roles[0].toUpperCase() === "PUBLIC") return next();
        if (!req.session.user) return res.status(401).send({status: 'error', error: 'Usuario no autenticado'});
        if (!roles.includes(req.session.user.role.toUpperCase())) return res.status(403).send({status:'error', error: 'Usuario no autorizado'});
        next();
    }
}
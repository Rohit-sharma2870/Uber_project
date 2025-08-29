exports.userauth=(req, res, next)=> {
    if (req.session && req.session.user){
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }
}


exports.capitanauth=(req, res, next) =>{
    if (req.session && req.session.capitan) {
    return next();
    } else {
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
    }
}

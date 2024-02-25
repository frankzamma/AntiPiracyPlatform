const jwt = require('jsonwebtoken');
const SECRET_KEY = "YOUR_SECRET_KEY";  //TODO aggiungere Secrete Key
const generateToken = (user) => {
    let sign = jwt.sign({ id: user._id, username: user.username, OrgName: user.OrgName }, SECRET_KEY, {
        expiresIn: '1h'
    });

    console.log(sign)

    return sign
}
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

const verifyTokenRequest = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send('Token not provided');

    console.log(authHeader)
    jwt.verify(authHeader, SECRET_KEY, (err, decoded) => {

        if (err){
            console.log(err)
            return res.status(403).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
};
module.exports = { generateToken, verifyToken, verifyTokenRequest};
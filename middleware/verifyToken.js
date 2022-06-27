const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(402).json({msg: 'کاربری شما غیر فعال می باشد .'});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
        req.userId = decoded.userId;
        req.cntId = decoded.cntId;
        next();
    })
}

module.exports = verifyToken;
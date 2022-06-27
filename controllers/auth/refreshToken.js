const Firebird = require('node-firebird');
const fboption = require('../../db/dbconf');
const jwt = require('jsonwebtoken');

const refreshToken = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        Firebird.attach(fboption, function (err, db) {
            if (err) throw err;
            console.log("Connection successfully...");
            db.query(
                "SELECT USR_UID, USRPASSWORD, USRFULLNAME, USRISACTIVE, USRISADMIN, USRACCOUNT, USRDESCRIPTION FROM TPUB_USERS WHERE REFRESH_TOKEN=?",
                [refreshToken],
                function (err, result) {
                    if (err) throw err;
                    console.log("Connection Database successfully...");
                    ussuccess = result.length;
                    console.log('count:' + ussuccess);
                    if(ussuccess){
                        console.log('Ok');
                        console.log(result[0].USRPASSWORD.toString(), result[0].USRACCOUNT.toString());
                        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                            if(err) return res.sendStatus(403);
                            const userName = result[0].USRACCOUNT.toString();
                            const userFullName = iconv.decode(result[0].USRFULLNAME.toString, 'WINDOWS-1256');
                            const userDes = iconv.decode(result[0].USRDESCRIPTION.toString, 'WINDOWS-1256');
                            const accessToken = jwt.sign({userId, userName, userFullName, userDes}, process.env.ACCESS_TOKEN_SECRET,{
                                expiresIn: '15s'
                            });
                        });
                        res.json({ accessToken });
                    } else return res.sendStatus(403);
                }
            );
            db.detach();
        });
    } catch(error) {
        console.log(error);
    }
}

module.exports = refreshToken;
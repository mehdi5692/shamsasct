const express = require('express');
const Firebird = require('node-firebird');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const createHash = crypto.createHash;
const iconv = require('iconv-lite');
const fboption = require('../../db/dbconf');

function sha1(txt) {
	return createHash('md5') // <-- You can use other than sha1
  		.update(txt) //set what to encode
  		.digest('hex') //basically another way to encode. hex is base16 so for example doing .digest('base64') encodes 4x more effenciently
}

const controller = {
    login: (req, res) => {
        console.log("Login**********************************");
        console.log(req.body);
        outputCode = 0;
        if(req.body.user){
            if(req.body.pass) {
                var pass = sha1(req.body.pass).toUpperCase();
                console.log(req.body.user);
                console.log(pass.toUpperCase());
                Firebird.attach(fboption, function (err, db) {
                    if (err) throw err;
                    console.log("Connection successfully...");
                    db.query(
                        "SELECT USR_UID, USRPASSWORD, USRFULLNAME, USRISACTIVE, USRISADMIN, USRACCOUNT, USRDESCRIPTION FROM TPUB_USERS WHERE USRACCOUNT=? AND USRPASSWORD=?",
                        [req.body.user, sha1(req.body.pass).toUpperCase()],
                        function (err, result) {
                            if (err) throw err;
                            console.log("Connection Database successfully...");
                            ussuccess = result.length;
                            console.log('count:' + ussuccess);
                            if(ussuccess){
                                console.log('Ok');
                                console.log(result[0].USRPASSWORD.toString(), result[0].USRACCOUNT.toString());
                                if (result[0].USRISACTIVE == 1) {
                                    const userId = result[0].USR_UID.toString();
                                    console.log(userId);
                                    const userName = result[0].USRACCOUNT.toString();
                                    const userFullName = iconv.decode(result[0].USRFULLNAME, 'WINDOWS-1256');
                                    const userDes = iconv.decode(result[0].USRDESCRIPTION, 'WINDOWS-1256');
                                    const accessToken = jwt.sign({userId, userName, userFullName, userDes}, process.env.ACCESS_TOKEN_SECRET,{
                                        expiresIn: '60m'
                                    });
                                    const refreshToken = jwt.sign({userId, userName, userFullName, userDes}, process.env.REFRESH_TOKEN_SECRET,{
                                        expiresIn: '1d'
                                    });
                                    console.log("////////////" + accessToken);
                                    // console.log("*********************************************************************");
                                    // console.log(refreshToken);
                                    db.query('update TPUB_USERS set REFRESH_TOKEN = ? where USR_UID = ?',
                                        [accessToken, userId],
                                        function(err, result) {
                                            console.log("Result:" + result);
                                            db.detach();
                                            res.status(200).json({accessToken});
                                            db.detach();
                                        });
                                       
                                    // res.cookie('refreshToken', refreshToken,{
                                    //     httpOnly: true,
                                    //     maxAge: 24 * 60 * 60 * 1000
                                    // });
                                    
                                    
                                } else res.status(404).json({msg: 'کاربری شما غیر فعال می باشد .'});
                            } else res.status(404).json({msg : "نام کاربری یا رمز عبور شما اشتباه می باشد ."});
                        }
                    );
                });
                Firebird
            } else {
                res.status(404).json({msg : 'Note Password'});
            }
        }
    },
    token: (req, res) => {
        console.log("Token*************************************");
        if(req.body.accessToken) {
            console.log("req.token: " + req.body.accessToken);
            jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err) return res.sendStatus(401);
                console.log("jwtverify: " + decoded.userId);
                // req.userId = decoded.userId;
                Firebird.attach(fboption, function (err, db) {
                    if (err) return res.sendStatus(402);
                    console.log("Connection successfully...");
                    db.query('select REFRESH_TOKEN from TPUB_USERS where USR_UID = ?', [decoded.userId], (err, result) => {
                        if(result.length) {
                            console.log(result[0].REFRESH_TOKEN);
                            if (req.body.accessToken === result[0].REFRESH_TOKEN) {
                                console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                res.status(200).json({accessToken: result[0].REFRESH_TOKEN});
                            } else return res.sendStatus(403);
                        } else return res.sendStatus(404);
                        db.detach();
                    });
                });
            });
        }
    }

}

module.exports = controller;
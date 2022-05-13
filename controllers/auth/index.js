const express = require('express');
const Firebird = require('node-firebird');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const createHash = crypto.createHash;

const fboption = {};
                fboption.host = "localhost";
                fboption.port = 3050;
                fboption.database = "SCT";
                fboption.user = "SYSDBA";
                fboption.password = "masterkey";
                fboption.characterset = "win-1256";

function sha1(txt) {
	return createHash('md5') // <-- You can use other than sha1
  		.update(txt) //set what to encode
  		.digest('hex') //basically another way to encode. hex is base16 so for example doing .digest('base64') encodes 4x more effenciently
}

const controller = {
    login: (req, res) => {
        console.log("**********************************");
        console.log(req.body);
        outputCode = 0;
        if(req.body.username){
            if(req.body.userpass) {
                var pass = sha1(req.body.userpass).toUpperCase();
                console.log(req.body.username);
                console.log(pass.toUpperCase());
                Firebird.attach(fboption, function (err, db) {
                    if (err) throw err;
                    console.log("Connection successfully...");
                    db.query(
                        "SELECT USR_UID, USRPASSWORD, USRFULLNAME, USRISACTIVE, USRISADMIN, USRACCOUNT, USRDESCRIPTION FROM TPUB_USERS WHERE USRACCOUNT=? AND USRPASSWORD=?",
                        [req.body.username, sha1(req.body.userpass).toUpperCase()],
                        function (err, result) {
                            if (err) throw err;
                            console.log("Connection Database successfully...");
                            ussuccess = result.length;
                            console.log('count:' + ussuccess);
                            if(ussuccess){
                                console.log('Ok');
                                console.log(result[0].USRPASSWORD.toString(), result[0].USRACCOUNT.toString());
                                if (result[0].USRISACTIVE == 0) {
                                    res.status(200).json({msg: 'کاربری شما غیر فعال می باشد .'});
                                } else res.status(200).json({msg : "خوش آمدید ..."});
                            } else res.status(400).json({msg : "نام کاربری یا رمز عبور شما اشتباه می باشد ."});
                        }
                    );
                    db.detach();
                });
            } else {
                res.status(400).json({msg : 'Note Password'});
            }
        }
        var pass = sha1('123');
    }

}

module.exports = controller;
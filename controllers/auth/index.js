const express = require('express');
const Firebird = require('node-firebird');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const createHash = crypto.createHash;

const fboption = {};
fboption.host = '192.168.100.4';
fboption.port = 3050;
fboption.database = 'sct';
fboption.user = 'SYSDBA';
fboption.password = 'masterkey';
fboption.characterset = 'win-1256';



function sha1(txt) {
	return createHash('md5') // <-- You can use other than sha1
  		.update(txt) //set what to encode
  		.digest('hex') //basically another way to encode. hex is base16 so for example doing .digest('base64') encodes 4x more effenciently
}

const controller = {
    login: (req, res) => {
        console.log("**********************************");
        // console.log(req);
        console.log(req.body);
        if(req.body.username){
            if(req.body.userpass) {
                var pass = sha1(req.body.userpass).toUpperCase();
                console.log(pass);
                Firebird.attach(fboption, function(err, db) {
                    if(err) {
                        throw err;
                    }
                    db.query('SELECT USR_UID, USRPASSWORD, USRFULLNAME, USRISACTIVE, USRISADMIN, USRACCOUNT, USRDESCRIPTION FROM TPUB_USERS WHERE USRACCOUNT=? AND USRPASSWORD=?', [req.body.username, pass],function(err, result) {
                        // console.log(result);
                        usucsses = result.length;
                        console.log("count"+result);
                        if (usucsses > 0) {
                            if (result[0].USRISACTIVE == 0) {
                                res.json({"msg": 'کاربری شما غیر فعال می باشد .'});
                            } else {
                                if (result[0].USRISADMIN == 1) {
                                    console.log('admin');
                                    res.json({"msg": 'شما مدیر سیستم می باشید .'});
                                } else {
                                    res.json({"msg": 'خوش آمدید'});
                                }
                            }
                        } else res.json({"msg": 'نام کاربری یا رمز عبور اشتباه می باشد .'});
                    });
                    db.detach();
                });
            } else {
                res.status(400).send({"msg" : 'Note Password'});
            }
        }
        var pass = sha1('123');
        res.json({'hash': pass.toUpperCase(), 'lenght': pass.length});
        // res.send("connection successfully");
    }

}

module.exports = controller;
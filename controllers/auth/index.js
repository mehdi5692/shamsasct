const fb = require('node-firebird');
const crypto = require('crypto');
const createHash = crypto.createHash;

const fbOption = require('../../db/dbconf');


function sha1(txt) {
	return createHash('md5') // <-- You can use other than sha1
  		.update(txt) //set what to encode
  		.digest('hex') //basically another way to encode. hex is base16 so for example doing .digest('base64') encodes 4x more effenciently
}

const controller = {
    login: (req, res) => {
        fb.attach(fbOption, function(err, db) {
            if(err) 
                throw err;
            db.sequentially("select * from TPUB_USERS", function(row, index) {
                // console.log(result);
                var pass = sha1('123');
                res.json({'hash': pass.toUpperCase(), 'lenght': pass.length});
            });
            db.detach();
        });
        // res.send("connection successfully");
    }

}

module.exports = controller;
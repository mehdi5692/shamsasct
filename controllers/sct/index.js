const express = require('express');
const Firebird = require('node-firebird');
const crypto = require('crypto');
const iconv = require('iconv-lite');
const fboption = require('../../db/dbconf');
const { Console } = require('console');
const fs = require('fs');
const Stream = require('stream');
const { resolve } = require('path');
const { rejects } = require('assert');
const { EventEmitter } = require('stream');

// const phath = require('path');


// const imageconvertor = async (atchUid) => {
//     if(atchUid) {
//         console.log('imageconvertor');
//         Firebird.attach(fboption, function (err, db) {
//             if (err) {
//                 return('ارتباط با بانک اطلاعاتی برقرار نمی باشد .');
//             } else {
//                 console.log("Connection AtchImg successfully...");
//                 // console.log(req.body);
//                 console.log(atchUid);
//                 sql1 = "SELECT ATCH_THUMBNAIL, ATCH_SIZE, BLOB_UID FROM TDOC_DOCUMENT_ATTACHMENTS WHERE DOCATCH_UID = ?";
//                 db.query(sql1, [atchUid], async (err, rows) => {
//                     if(err) {
//                         return('در بارگزاری اطلاعات مشکلی رخ داده ...');
//                     } else {
//                         if(rows.length) {
//                             console.log("OK atchstreamimage!");
//                             // console.log(result);
//                             await rows[0].ATCH_THUMBNAIL(async function(err, name, e) {
//                                 if(err) {
//                                     return('در بارگزاری اطلاعات مشکلی رخ داده ...');
//                                 } else {
//                                     let buffers = []
//                                     e.on('data', (chunk) => {
//                                         buffers.push(chunk);
//                                     });
//                                     await e.on('end', () => {
//                                         let buffer = Buffer.concat(buffers);
//                                         console.log('output data:');
//                                         console.log(buffer.toString('base64'));
//                                         return buffer.toString('base64');
//                                     });
//                                 }
//                             });
//                         } else return('هیچ موردی یافت نشد ...');
//                     }
//                     db.detach();
//                 });
//             }
//         });
//     } else return('کاربری شما غیر فعال می باشد .');
// }
// function readBLOB(callback) {
//     let result = []
//     async function f() {
//         await new Promise(async (resolve, reject) => {
//             await callback(async (err, _, eventEmitter) => {
//                 let buffers = [];
//                 if (err) reject(err);
//                 eventEmitter.on("data", chunk => {
//                     buffers.push(chunk);
//                 });
//                 await eventEmitter.once("end", function (e) {
//                     resolve(Buffer.concat(buffers));
//                 });
//             });
//         }).then(buf => {
//             result = buf
//         })
//     }
//     f();
//     return result;
// } 
const controller = {
    create: (req, res) => {
        res.json("{text: 'sdfadfafsdf'}");
    },
    fetchAll: (req, res) => {
        res.json({text: 'fetchAll'});
    },
    cardtable: (req, res) => {
        if(req.cntId) {
            console.log()
            Firebird.attach(fboption, function (err, db) {
                if (err) {
                    return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                } else {
                    // console.log("Connection successfully...");
                    sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_SUBJECT, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, DCI.DOC_RECIPIENTS, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE  \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DCR.PF_READ = 0 ORDER BY DCR.PF_ENTERANCE_DATE desc";
                    db.query(sql1, [req.cntId], (err, result) => {
                        if(err) {
                            return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                        } else {
                            console.log(result);
                            if(result.length) {
                                console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                res.status(200).json(result);
                            } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                        }
                    db.detach();
                    });
                }
            });
        }
    },
    allincomdocuments: (req, res) => {
        if(req.cntId) {
            Firebird.attach(fboption, function (err, db) {
                if (err) {
                    return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                } else {
                    // console.log("Connection successfully...");
                    sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_SUBJECT, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, DCI.DOC_RECIPIENTS, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE  \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DOC_TYPE = 0 ORDER BY DCR.PF_ENTERANCE_DATE desc";
                    db.query(sql1, [req.cntId], (err, result) => {
                        if(err) {
                            return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                        } else {
                            if(result.length) {
                                console.log("OK@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                                res.status(200).json(result);
                            } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                        }
                        db.detach();
                    });
                }
            });
        }
    },
    allissudocuments: (req, res) => {
        if(req.cntId) {
            Firebird.attach(fboption, function (err, db) {
                if (err) {
                    return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                } else {
                    // console.log("Connection successfully...");
                    sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_SUBJECT, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, DCI.DOC_RECIPIENTS, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE  \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DOC_TYPE = 1 ORDER BY DCR.PF_ENTERANCE_DATE desc";
                    db.query(sql1, [req.cntId], (err, result) => {
                        if(err) {
                            return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                        } else {
                            if(result.length) {
                                console.log("OK^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                                res.status(200).json(result);
                            } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                        }
                        db.detach();
                    });
                }
            });
        }
    },
    documentatchdata: async (req, res) => {
        // if(req.cntId) {
            console.log('++++++++++++++++++++++++++++++++');
            await Firebird.attach(fboption, async function (err, db) {
                if (err) {
                    return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                } else {
                    console.log("Connection Atch successfully...");
                    // console.log(req.body.DOC_UID);
                    let docUid = iconv.decode(req.body.DOC_UID.data, 'WINDOWS-1251')
                    console.log(docUid);
                    db.transaction(async function(err, transaction) {
                        if(err) {
                            return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                        } else {
                            sql1 = "SELECT DOCATCH_UID, ATCH_THUMBNAIL, BLOB_UID FROM TDOC_DOCUMENT_ATTACHMENTS WHERE DOC_UID = ?";
                            db.query(sql1, [docUid], async (err, result) => {
                                if(err) {
                                    return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                                } else {
                                    if(err) return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ....'});
                                    if(result.length) {
                                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                        for (let i=0 ; i<result.length; i++) {
                                            let buffer = []
                                            await new Promise(async (resolve, reject) => {
                                                await result[i].ATCH_THUMBNAIL(async (err, name, e) => {
                                                    console.log('test1');
                                                    let buffers = [];
                                                    if (err) {
                                                        res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده .....'});
                                                    } else {
                                                        e.on('data', (chunk) => {
                                                            buffers.push(chunk);
                                                        });
                                                        await e.once('end', () => {
                                                            // buffer = Buffer.concat(buffers);
                                                            console.log(buffer.toString('base64'));   
                                                            // return buffer.toString('base64');
                                                            resolve(Buffer.concat(buffers));
                                                        });
                                                    }
                                                });
                                            }).then(buf => {
                                                buffer = buf;
                                            })
                                            
                                            // console.log(buffer.toString('base64'));
                                            result[i].THUMBNAIL_DATA = buffer.toString('base64');
                                            // console.log(result[i]);
                                            // result[i].THUMBNAIL_FILE = 'http://localhost:5000/applog/thumbnail' + i + '.jpg';
                                            // result[i].IMG_DATA = imgdata;
                                            // await imageconvertor(result[i].DOCATCH_UID.toString()).then(str =>{
                                            //     console.log(str);
                                            // });
                                            // console.log(readBLOB(result[i].ATCH_THUMBNAIL));
                                            db.detach();
                                            
                                        };
                                        console.log(result);
                                        res.status(200).json(result);
                                    } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                                }
                                db.detach();
                            });
                        }
                    });
                }
            });
        // } else return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
    },
    atchstreamimage: (req, res) => {
        // if(req.cntId) {
            console.log('atchstreamimage');
            Firebird.attach(fboption, function (err, db) {
                if (err) {
                    return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                } else {
                    console.log("Connection AtchImg successfully...");
                    // console.log(req.body);
                    let atchUid = iconv.decode(req.body.DOCATCH_UID.data, 'WINDOWS-1251')
                    console.log(atchUid);
                    sql1 = "SELECT ATCH_THUMBNAIL, ATCH_SIZE, BLOB_UID FROM TDOC_DOCUMENT_ATTACHMENTS WHERE DOCATCH_UID = ?";
                    db.query(sql1, [atchUid], (err, rows) => {
                        if(err) {
                            return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                        } else {
                            if(rows.length) {
                                console.log("OK atchstreamimage!");
                                // console.log(result);
                                const fileSize = rows[0].ATCH_SIZE
                                rows[0].ATCH_THUMBNAIL(function(err, name, e) {
                                    if(err) {
                                        return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ....'});
                                    } else {
                                        let buffers = []
                                        e.on('data', (chunk) => {
                                            buffers.push(chunk);
                                        });
                                        e.on('end', () => {
                                            let buffer = Buffer.concat(buffers);
                                            console.log('output data:');
                                            console.log(buffer.toString('base64'));
                                            res.status(200).json({data: buffer.toString('base64')});
                                        });
                                    }
                                });
                                // res.json(rows[0].ATCH_THUMBNAIL.toString('base64'));
                                
                            } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                        }
                        db.detach();
                    });
                }
            });
        // } else return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
    }
}

module.exports = controller;
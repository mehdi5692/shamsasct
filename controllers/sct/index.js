const express = require('express');
const Firebird = require('node-firebird');
const crypto = require('crypto');
const iconv = require('iconv-lite');
const fboption = require('../../db/dbconf');
const { Console } = require('console');
const fs = require('fs');

// const phath = require('path');



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
                if (err) return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                // console.log("Connection successfully...");
                sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_SUBJECT, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, DCI.DOC_RECIPIENTS, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE  \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DCR.PF_READ = 0 ORDER BY DCR.PF_ENTERANCE_DATE desc";
                db.query(sql1, [req.cntId], (err, result) => {
                    console.log(result);
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        res.status(200).json(result);
                    } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                    db.detach();
                });
            });
        }
    },
    allincomdocuments: (req, res) => {
        if(req.cntId) {
            Firebird.attach(fboption, function (err, db) {
                if (err) return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                // console.log("Connection successfully...");
                sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_SUBJECT, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, DCI.DOC_RECIPIENTS, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE  \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DOC_TYPE = 0 ORDER BY DCR.PF_ENTERANCE_DATE desc";
                db.query(sql1, [req.cntId], (err, result) => {
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        res.status(200).json(result);
                    } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                    db.detach();
                });
            });
        }
    },
    allissudocuments: (req, res) => {
        if(req.cntId) {
            Firebird.attach(fboption, function (err, db) {
                if (err) return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                // console.log("Connection successfully...");
                sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_SUBJECT, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, DCI.DOC_RECIPIENTS, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE  \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DOC_TYPE = 1 ORDER BY DCR.PF_ENTERANCE_DATE desc";
                db.query(sql1, [req.cntId], (err, result) => {
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        res.status(200).json(result);
                    } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                    db.detach();
                });
            });
        }
    },
    documentatchdata: async (req, res) => {
        if(req.cntId) {
            console.log('++++++++++++++++++++++++++++++++');
            Firebird.attach(fboption, function (err, db) {
                if (err) return res.status(403).json({msg: 'ارتباط با بانک اطلاعاتی برقرار نمی باشد .'});
                console.log("Connection Atch successfully...");
                let docUid = iconv.decode(req.body.DOC_UID.data, 'WINDOWS-1251')
                console.log(docUid);
                db.transaction(function(err, transaction) {
                    sql1 = "SELECT ATCH_THUMBNAIL, BLOB_UID FROM TDOC_DOCUMENT_ATTACHMENTS WHERE DOC_UID = ?";
                    db.query(sql1, [docUid], async (err, result) => {
                        if(err) return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                        if(result.length) {
                            console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                            console.log(result);
                            for (let i=0 ; i<result.length; i++) {
                                const thm_data = await result[i].ATCH_THUMBNAIL(async (err, name, e) => {
                                    if (err) return res.status(404).json({msg: 'در بارگزاری اطلاعات مشکلی رخ داده ...'});
                                    var imgStream = await fs.createWriteStream('public/applog/thumbnail' + i + '.jpg');
                                    await e.pipe(imgStream);
                                    return e;
                                });
                                console.log(thm_data);
                                result[i].THUMBNAIL_DATA = thm_data;
                                result[i].THUMBNAIL_FILE = 'http://localhost:5000/applog/thumbnail' + i + '.jpg';
                            };
                            res.status(200).json(result);
                        } else return res.status(404).json({msg: 'هیچ موردی یافت نشد ...'});
                        db.detach();
                    });
                })
            });
        } else return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
    }
}

module.exports = controller;
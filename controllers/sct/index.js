const express = require('express');
const Firebird = require('node-firebird');
const crypto = require('crypto');
const iconv = require('iconv-lite');
const fboption = require('../../db/dbconf');

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
            Firebird.attach(fboption, function (err, db) {
                if (err) return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
                // console.log("Connection successfully...");
                sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_PRIORITY, DC.DOC_SUBJECT, \n"+
                    "DC.DOC_CLASSIFICATION, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, \n"+
                    "DCI.DOC_RECIPIENTS, DC.DOC_NO, DC.DOC_DATE, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DCR.PF_READ = 0";
                db.query(sql1, [req.cntId], (err, result) => {
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        // for (var i=0; i < result.length; i++){
                        //     if (result[i].DOC_UID) result[i].DOC_UID = JSON.stringify(result[i].DOC_UID);
                        //     if (result[i].DOC_TYPE) result[i].DOC_TYPE = JSON.stringify(result[i].DOC_TYPE.toString());
                        //     if (result[i].DOC_TITLE) result[i].DOC_TITLE = iconv.decode(result[i].DOC_TITLE, 'WINDOWS-1256');
                        // }
                        res.status(200).json(result);
                    } else return res.status(404).json({msg: 'کاربری شما غیر فعال می باشد .'});
                    db.detach();
                });
            });
        }
    },
    allincomdocuments: (req, res) => {
        if(req.cntId) {
            Firebird.attach(fboption, function (err, db) {
                if (err) return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
                // console.log("Connection successfully...");
                sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_PRIORITY, DC.DOC_SUBJECT, \n"+
                    "DC.DOC_CLASSIFICATION, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, \n"+
                    "DCI.DOC_RECIPIENTS, DC.DOC_NO, DC.DOC_DATE, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DOC_TYPE = 0";
                db.query(sql1, [req.cntId], (err, result) => {
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        // for (var i=0; i < result.length; i++){
                        //     if (result[i].DOC_UID) result[i].DOC_UID = JSON.stringify(result[i].DOC_UID);
                        //     if (result[i].DOC_TYPE) result[i].DOC_TYPE = JSON.stringify(result[i].DOC_TYPE.toString());
                        //     if (result[i].DOC_TITLE) result[i].DOC_TITLE = iconv.decode(result[i].DOC_TITLE, 'WINDOWS-1256');
                        // }
                        res.status(200).json(result);
                    } else return res.status(404).json({msg: 'کاربری شما غیر فعال می باشد .'});
                    db.detach();
                });
            });
        }
    },
    allissudocuments: (req, res) => {
        if(req.cntId) {
            Firebird.attach(fboption, function (err, db) {
                if (err) return res.status(403).json({msg: 'کاربری شما غیر فعال می باشد .'});
                // console.log("Connection successfully...");
                sql1 = "SELECT DC.DOC_UID, DC.DOC_TYPE, DC.DOC_TITLE, DC.DOC_PRIORITY, DC.DOC_SUBJECT, \n"+
                    "DC.DOC_CLASSIFICATION, DCR.PF_READ, DCR.PF_ENTERANCE_DATE, DCI.DOC_SENDER, \n"+
                    "DCI.DOC_RECIPIENTS, DC.DOC_NO, DC.DOC_DATE, DCRG.DOC_FULL_CODE, DCRG.DOC_REG_DATE \n"+
                    "FROM TDOC_DOCUMENTS DC \n"+
                    "LEFT JOIN TDOC_DOCUMENT_RECIPIENTS DCR ON DCR.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_INFO DCI ON DCI.DOC_UID = DC.DOC_UID \n"+
                    "LEFT JOIN TDOC_DOCUMENT_REGISTER DCRG ON DCRG.DOC_UID = DC.DOC_UID \n"+
                    "WHERE DCR.CNT_UID = ? AND DOC_TYPE = 1";
                db.query(sql1, [req.cntId], (err, result) => {
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        // for (var i=0; i < result.length; i++){
                        //     if (result[i].DOC_UID) result[i].DOC_UID = JSON.stringify(result[i].DOC_UID);
                        //     if (result[i].DOC_TYPE) result[i].DOC_TYPE = JSON.stringify(result[i].DOC_TYPE.toString());
                        //     if (result[i].DOC_TITLE) result[i].DOC_TITLE = iconv.decode(result[i].DOC_TITLE, 'WINDOWS-1256');
                        // }
                        res.status(200).json(result);
                    } else return res.status(404).json({msg: 'کاربری شما غیر فعال می باشد .'});
                    db.detach();
                });
            });
        }
    }
}

module.exports = controller;
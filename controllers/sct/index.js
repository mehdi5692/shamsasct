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
                    "WHERE DCR.CNT_UID = ?";
                db.query(sql1, [req.cntId], (err, result) => {
                    if(result.length) {
                        console.log("OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        res.status(200).json(JSON.stringify(result));
                    } else return res.status(404).json({msg: 'کاربری شما غیر فعال می باشد .'});
                    db.detach();
                });
            });
        }
    }
}

module.exports = controller;
const phath = require('path');



const controller = {
    create: (req, res) => {
        res.json("{text: 'sdfadfafsdf'}");
    },
    fetchAll: (req, res) => {
        res.json("{text: 'testt'}");
    }
}

module.exports = controller;
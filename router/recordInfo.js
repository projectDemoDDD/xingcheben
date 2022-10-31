const { getData, insertData, getDatas, updateData, getTime, deleteData } = require('../db.js')

const express = require('express')
const router=express.Router()


//添加日志
router.post('/addRecord', (req, res) => {
    const doc = req.body;
    insertData('recordInfo', doc)
    res.send('添加成功！')
})

module.exports = router;


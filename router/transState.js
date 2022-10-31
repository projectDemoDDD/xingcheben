const { getData, insertData, getDatas, updateData, getTime, deleteData } = require('../db.js')

const express = require('express')
const router=express.Router()

//新增车辆状态
router.post('/insertTransStateInfo', (req, res) => {

    try {
        const doc = req.body;
        if(req.body===undefined||req.body===null){
            res.status(200).send('body-is-null')
            return;
        }
        insertData('transState', doc).then(
            su=>{
                res.status(200).send('handleSucess')
            },
            fail=>{
                res.status(200).send('dataBase-error')
            }
        )
        
    } catch (ex) {
        console.log(ex)
        res.status(200).send('server-undefinedError')
    }

})


//更新车辆状态数据
router.post('/updateTransStateInfo', (req, res) => {

    try {
        const doc = req.body;
        if(doc===undefined||doc===null){
            res.status(200).send('body-is-null')
            return;
        }
        if(doc.where===undefined||doc.where===null){
            res.status(200).send('body-where-is-null')
            return;
        }
        if(doc.body===undefined||doc.body===null){
            res.status(200).send('body-body-is-null')
            return;
        }
        updateData('transState', doc.where, doc.body).then(
            su=>{
                res.status(200).send('handleSucess')
            },
            fail=>{
                res.status(200).send('dataBase-error')
            }
        )
        
    } catch (ex) {
        console.log(ex)
        res.status(200).send('server-undefinedError')
    }

})

//获取车辆状态
router.get('/transStateQuerys', (req, res) => {

    try {
        if (req.query.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }
        getDatas('transState', JSON.parse(req.query.where)).then(
            data => {
                if (data == null || data == '') {
                    res.status(200).send("data-null");
                    return;
                }
                res.status(200).send(data);
            },
            error => {
                res.status(200).send('dataBase-error')
            })
    } catch (ex) {
        res.status(200).send('server-undefinedError')
    }

})


module.exports = router;
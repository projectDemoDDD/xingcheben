const { getData, insertData, getDatas, updateData, getTime, deleteData } = require('../db.js')

const express = require('express')
const router=express.Router()


//向transInfo中添加数据
router.post('/insertTransInfo', (req, res) => {


    try {
        const doc = req.body;
        if(req.body===undefined||req.body===null){
            res.status(200).send('body-is-null')
            return;
        }
        insertData('transInfo', doc).then(
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

//获取transInfo中的多条数据
router.get('/transInfoQuery', (req, res) => {

    try {
        if (req.query.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }
        getDatas('transInfo', JSON.parse(req.query.where)).then(
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
const { getData, insertData, getDatas, updateData, getTime, deleteData } = require('../db.js')
const express = require('express')
const router = express.Router()

//请求接口
//参数
// let where = {
//     UserName: this.userName,
//     Password: this.password,
//   };
//根据req.query.where获取userInfo中的一条数据
router.get('/userInfo', (req, res) => {

    try {
        if (req.query.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }
        getData('userInfo', JSON.parse(req.query.where)).then(
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


//添加类接口
//向userInfo中插入一条数据
router.post('/register', (req, res) => {
    try {
        const doc = req.body;
        if(req.body===undefined||req.body===null){
            res.status(200).send('body-is-null')
            return;
        }
        insertData('userInfo', doc).then(
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





//更新userInfo指定的数据
//参数 where UserName
//userInfo
router.post('/updateUserInfo', (req, res) => {
    try {
        const doc = req.body;
        if (doc.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }
        if (doc.userInfo === undefined) {
            res.status(200).send('userInfo-undefined')
            return;
        }
        updateData('userInfo', doc.where, doc.userInfo)
        res.status(200).send('handleSucess')
    }
    catch (ex) {
        res.status(200).send('server-error')
    }
})




//清空数据
router.delete('/deleteAllUserInfo', (req, res) => {

    deleteData('userInfo', {}).then(
        data => {
            console.log("删除成功")
            res.status(200).json('data');
        },
        error => {
            console.log("删除失败")
            res.status(500).json('失败')
        })
})




module.exports = router;

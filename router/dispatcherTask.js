const { getData, insertData, getDatas, updateData, getTime, deleteData } = require('../db.js')
const express = require('express')
const { Int32, Double } = require('mongodb')
const router = express.Router()


router.get('/taskInfo', (req, res) => {

    try {
        if (req.query.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }
        getData('taskInfo', JSON.parse(req.query.where)).then(
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


router.post('/insertTaskInfo', (req, res) => {
    try {
        const doc = req.body;
        if (req.body === undefined || req.body === null) {
            res.status(200).send('body-is-null')
            return;
        }
        insertData('taskInfo', doc).then(
            su => {
                res.status(200).send('handleSucess')
            },
            fail => {
                res.status(200).send('dataBase-error')
            }
        )

    } catch (ex) {
        console.log(ex)
        res.status(200).send('server-undefinedError')
    }
})


router.post('/updateTaskInfo', (req, res) => {
    try {
        const doc = req.body;
        if (doc.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }
        if (doc.info === undefined) {
            res.status(200).send('info-undefined')
            return;
        }
        updateData('taskInfo', doc.where, doc.info)
        res.status(200).send('handleSucess')
    }
    catch (ex) {
        res.status(200).send('server-error')
    }
})

router.get('/taskInfoStatic', (req, res) => {

    try {
        if (req.query.where === undefined) {
            res.status(200).send('where-undefined')
            return;
        }

        let map = new Map();

        let where = JSON.parse(req.query.where);

        //console.log(`where:${JSON.stringify(where)}`)

        Function.prototype.where={
            guid:where.guid
        }
        //console.log(`router.where:${JSON.stringify(router.where)}`)

       

        getDatas('transState', where).then(
            dataState => {
                if (dataState == null || dataState == '') {
                    res.status(200).send("data-null");
                    return;
                }

                getDatas('transInfo', where).then(
                    dataTransInfo => {
                        if (dataTransInfo == null || dataTransInfo == '') {
                            res.status(200).send("data-null");
                            return;
                        }

                        console.log(`router.where1111:${JSON.stringify(Function.prototype.where)}`)

                        dataTransInfo.forEach(element => {
                            if (!map.has(element.DestinatLocation)) {

                                let resData = {
                                    name: element.DestinatLocation,
                                    completeCount: 0,
                                    completeFangliang: 0,
                                    queueCount: 0,
                                    queueFangliang: 0,
                                    onRoadCount: 0,
                                    onRoadFangliang: 0,
                                    onWorkCount: 0,
                                    onWorkFangliang: 0
                                }
                                map.set(element.DestinatLocation, resData);

                            }
                            let resData = map.get(element.DestinatLocation);
                            resData.completeCount++;
                            resData.completeFangliang = resData.completeFangliang + parseInt(element.RealFangliang)
                        });

                        dataState.forEach(element => {
                            let resData = {};

                            if (element.state === 'rest' || element.state === 'waitTask' || element.state === 'waitAccept') {

                            } else {
                                if (!map.has(element.DestinatLocation)) {

                                    let resData = {
                                        name: element.DestinatLocation,
                                        completeCount: 0,
                                        completeFangliang: 0,
                                        queueCount: 0,
                                        queueFangliang: 0,
                                        onRoadCount: 0,
                                        onRoadFangliang: 0,
                                        onWorkCount: 0,
                                        onWorkFangliang: 0
                                    }
                                    map.set(element.DestinatLocation, resData);

                                }
                                resData = map.get(element.DestinatLocation);


                                switch (element.state) {
                                    case "accept":
                                        resData.queueCount++;
                                        resData.queueFangliang = resData.queueFangliang + parseFloat(element.RealFangliang)
                                        break;
                                    case "loadThing":
                                        resData.queueCount++;
                                        resData.queueFangliang = resData.queueFangliang + parseFloat(element.RealFangliang)
                                        break;
                                    case "start":
                                        resData.onRoadCount++;
                                        resData.onRoadFangliang = resData.onRoadFangliang + parseFloat(element.RealFangliang)
                                        break;
                                    case "arrival":
                                        resData.onWorkCount++;
                                        resData.onWorkFangliang = resData.onWorkFangliang + parseFloat(element.RealFangliang)
                                        break;
                                    case "startOff":
                                        resData.onWorkCount++;
                                        resData.onWorkFangliang = resData.onWorkFangliang + parseFloat(element.RealFangliang)
                                        break;
                                    case "offComplete":
                                        resData.onWorkCount++;
                                        resData.onWorkFangliang = resData.onWorkFangliang + parseFloat(element.RealFangliang)
                                        break;
                                }
                            }

                        });


                        res.status(200).send([...map.values()])


                    },
                    error => {
                        res.status(200).send('dataBase-error')
                    })

            },
            error => {
                res.status(200).send('dataBase-error')
            })
    } catch (ex) {
        res.status(200).send('server-undefinedError')
    }

})




module.exports = router;

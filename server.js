const express = require('express')
const xlsx = require('node-xlsx')
const fs = require('fs')


const deleteAllData =require('./test/debug.js');

//deleteAllData();


const { getData, insertData, getDatas, updateData, getTime, deleteData } = require('./db')

const userInfoRounter=require('./router/userInfo')
const recordInfoRounter=require('./router/recordInfo')
const carInfoRounter=require('./router/carInfo')
const transInfoRounter=require('./router/transInfo')
const StartLocationInfo=require('./router/StartLocationInfo')
const transState=require('./router/transState')
const dispatcherTask=require('./router/dispatcherTask')


const isDebug=true;




const app = express()
app.use(express.static('static'))
app.use(express.json())



app.get('/', (req, res) => {
    res.send("123");
})

app.use(userInfoRounter)
app.use(recordInfoRounter)
app.use(carInfoRounter)
app.use(transInfoRounter)
app.use(StartLocationInfo)
app.use(transState)
app.use(dispatcherTask)


//导出运输明细excel格式
app.get('/exportTransInfo', (req, res) => {

    // if (req.query.where === undefined) {
    //     res.status(500).send('报错了')
    //     return;
    // }
    let where ={
        queueName:'梦之队'
    }
    getDatas('transInfo', where).then(
        data => {
            var excelData = [
                {
                    name: 'sheet1',
                    data: [
                        [
                            '搅拌站',
                            '日期',
                            '工程名',
                            '司机',
                            '车号',
                            '车次',
                            '票面方量',
                            '等待时间'
                        ]
                    ]
                }
            ]
            //console.log(excelData[0].data)
            data.forEach(item => {
                let itemArray = []
                itemArray.push(item.StartLocation)
                itemArray.push(item.startTime)
                itemArray.push(item.DestinateLocation)
                itemArray.push(item.RealName)
                itemArray.push(item.CarNumber)
                itemArray.push(item.carCount)
                itemArray.push(item.FangLiang)
                itemArray.push(item.waitTime)
                excelData[0].data.push(itemArray)
            })
            //console.log(excelData[0].data)
             var buffer = xlsx.build(excelData);
            fs.writeFile('./result.xlsx', buffer, function (err) {
                if (err) {
                    console.log('123')
                }
            })
            res.send('导出成功！');
        },
        error => { res.status(500).send('报错了') })

})















//每日车次方量统计
//传入参数为某年，某月以及所属车队名称
function groupTransInfo(data, property, res) {
    let sumCount = 0
    let sumFanling = 0
    let map = new Map();
    data.forEach(element => {
        if (map.has(element[property])) {
            let obj = map.get(element[property]);
            obj.count++;
            obj.fangliang = parseInt(obj.fangliang) + parseInt(element.FangLiang);
        } else {
            let proName = element[property];
            if (property == 'UserName') {
                proName = element['RealName'];
            }
            if (property == 'dateYY') {
                proName = proName + '年';
            }
            if (property == 'dateMM') {
                proName = proName + '月份';
            }
            if (property == 'dateDD') {
                proName = proName + '号';
            }

            map.set(element[property], {
                count: 1,
                fangliang: element.FangLiang,
                projectname: proName,
                serchName: element[property],
            })
        }
        sumCount++;
        sumFanling += parseInt(element.FangLiang)
    });
    map.set('合计', {
        count: sumCount,
        fangliang: sumFanling,
        projectname: '合计'
    })
    let result = JSON.stringify([...map.values()]);
    res.send(result);
}


app.get('/dayCarCountFanliangTransInfoQuery', (req, res) => {

    //console.log(req.query)

    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    let where;
    let bodyContent = JSON.parse(req.query.where);
    //console.log(bodyContent)

    if (bodyContent.type == 'sj') {
        switch (bodyContent.staticcontent) {
            case "all"://按年分组
                where = {
                    queueName: bodyContent.queueName,
                    UserName: bodyContent.UserName,
                }
                break;
            case "yy"://按月分组
                where = {
                    dateYY: bodyContent.dateYY,
                    queueName: bodyContent.queueName,
                    UserName: bodyContent.UserName,
                }
                break;
            case "mm"://按日分组
                where = {
                    queueName: bodyContent.queueName,
                    UserName: bodyContent.UserName,
                    dateYY: bodyContent.dateYY,
                    dateMM: bodyContent.dateMM
                }
                break;
            case "dd"://按司机分组
                where = {
                    queueName: bodyContent.queueName,
                    UserName: bodyContent.UserName,
                    dateYY: bodyContent.dateYY,
                    dateMM: bodyContent.dateMM,
                    dateDD: bodyContent.dateDD
                }
                break;
        }
    }
    else {
        switch (bodyContent.staticcontent) {
            case "all"://按年分组
                where = {
                    queueName: bodyContent.queueName
                }
                break;
            case "yy"://按月分组
                where = {
                    dateYY: bodyContent.dateYY,
                    queueName: bodyContent.queueName,
                }
                break;
            case "mm"://按日分组
                where = {
                    queueName: bodyContent.queueName,
                    dateYY: bodyContent.dateYY,
                    dateMM: bodyContent.dateMM
                }
                break;
            case "dd"://按司机分组
                where = {
                    queueName: bodyContent.queueName,
                    dateYY: bodyContent.dateYY,
                    dateMM: bodyContent.dateMM,
                    dateDD: bodyContent.dateDD
                }
                break;
        }
    }

    getDatas('transInfo', where).then(
        data => {
            switch (bodyContent.staticcontent) {
                case "all":
                    groupTransInfo(data, 'dateYY', res);
                    break;
                case "yy":
                    groupTransInfo(data, 'dateMM', res);
                    break;
                case "mm":
                    groupTransInfo(data, 'dateDD', res);
                    break;
                case "dd":
                    groupTransInfo(data, 'UserName', res);
                    break;
            }
        },
        error => { res.status(500).send('报错了') })
})



//司机明细统计
app.get('/driverDetailStatic', (req, res) => {

    //console.log(req.query)

    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    let where;
    let bodyContent = JSON.parse(req.query.where);
    //console.log(bodyContent)

    if (bodyContent.type == 'sj') {
        switch (bodyContent.staticcontent) {
            case "yy":
                break;
            case "mm":
                break;
            case "dd":
                where = {
                    queueName: bodyContent.queueName,
                    dateYY: bodyContent.dateYY,
                    dateMM: bodyContent.dateMM,
                    dateDD: bodyContent.dateDD,
                    UserName: bodyContent.UserName
                }
                break;
        }
    } else {
        switch (bodyContent.staticcontent) {
            case "yy":
                break;
            case "mm":
                break;
            case "dd":
                where = {
                    queueName: bodyContent.queueName,
                    dateYY: bodyContent.dateYY,
                    dateMM: bodyContent.dateMM,
                    dateDD: bodyContent.dateDD,
                    UserName: bodyContent.UserName
                }
                break;
        }
    }

    getDatas('transInfo', where).then(
        data => {
            res.send(data);
        },
        error => { res.status(500).send('报错了') })
})




//当天各司机车次
app.get('/dayDriverCountTransInfoQuery', (req, res) => {
    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    getDatas('transInfo', JSON.parse(req.query.where)).then(
        data => {
            let sumCount = 0
            let sumFanling = 0
            let map = new Map();
            data.forEach(element => {
                if (map.has(element.UserName)) {
                    let obj = map.get(element.UserName);
                    obj.count++;
                    obj.fangliang = parseInt(obj.fangliang) + parseInt(element.FangLiang);
                } else {
                    map.set(element.UserName, {
                        count: 1,
                        RealName: element.RealName,
                        fangliang: element.FangLiang,
                        UserName: element.UserName,
                        dateDD: element.dateDD
                    })
                }
                sumCount++;
                sumFanling += parseInt(element.FangLiang)
            });
            map.set('合计', {
                count: sumCount,
                RealName: '合计',
                fangliang: sumFanling
            })
            let result = JSON.stringify([...map.values()]);
            res.send(result);
        },
        error => { res.status(500).send('报错了') })
})



app.get('/queueCarsInfoQuery', (req, res) => {


    // if(isDebug){
    //     console.log('/queueCarsInfoQuery')
    // }
    // if(isDebug){
    //     console.log(req.query.where)
    // }
    

    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }

    //获得车队的车主
    let whereHost = { queueName: JSON.parse(req.query.where).queue,isBoss:true };
    getData('userInfo', whereHost).then(
        data => {

            // if(isDebug){
            //     console.log(data)
            // }

            if (data == null || data == '') {
                res.status(500).send('报错了')
                return;
            }

            let finalWhere = { belong: data.UserName };
            //通过车主获得车主的车列表
            getDatas('carInfo', finalWhere).then(
                data1 => {
                    // if(isDebug){
                    //     console.log(finalWhere)
                    // }       
                    res.send(data1);
                },
                error => { res.status(500).json('没有取到数据') })


        },
        error => { res.status(500).json('没有取到数据') })


})





//删除起始地
app.get('/startLocationInfDelete', (req, res) => {
    if (req.query.where == null) {
        res.status(500).send('报错了')
        return;
    }
    deleteData('StartLocationInfo', JSON.parse(req.query.where)).then(
        data => {
            console.log("删除成功")
            res.status(200).json('data');
        },
        error => {
            console.log("删除失败")
            res.status(500).json('失败')
        })
})

//添加起始地
app.post('/addStartLocation', (req, res) => {
    const doc = req.body;
    insertData('StartLocationInfo', doc)
    res.send('注册成功')
})






//删除目的地
app.get('/destinateLocationInfDelete', (req, res) => {
    if (req.query.where == undefined) {
        res.status(500).send('报错了')
        return;
    }
    deleteData('DestinateLocationInfo', JSON.parse(req.query.where)).then(
        data => {
            console.log("删除成功")
            res.status(200).json('data');
        },
        error => {
            console.log("删除失败")
            res.status(500).json('失败')
        })
})

//添加目的地
app.post('/addDestinateLocation', (req, res) => {
    const doc = req.body;
    insertData('DestinateLocationInfo', doc)
    res.send('注册成功')
})





//获取目的地
app.get('/destinateLocationInfoQuery', (req, res) => {
    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }

    let objWhere = JSON.parse(req.query.where);

    if (objWhere.UserName != undefined) {
        getDatas('DestinateLocationInfo', objWhere).then(
            data => {
                res.send(data);
            },
            error => { res.status(500).json('没有取到数据') })
    }
    else{
        //获得车队的车主
    let whereHost = { queueName: JSON.parse(req.query.where).queue ,isBoss:true};
    getData('userInfo', whereHost).then(
        data => {

            if (data == null || data == '') {
                res.status(500).send('报错了')
                return;
            }

            let finalWhere = { UserName: data.UserName };
            //通过车主获得车主的车列表
            getDatas('DestinateLocationInfo', finalWhere).then(
                data1 => {
                    res.send(data1);
                },
                error => { res.status(500).json('没有取到数据') })


        },
        error => { res.status(500).json('没有取到数据') })
    }


})


//deleteData

app.get('/carsInfDelete', (req, res) => {
    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    deleteData('carInfo', JSON.parse(req.query.where)).then(
        data => { res.send('data'); },
        error => { res.status(500).send('报错了') })
})

app.get('/transStateDelete', (req, res) => {
    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    deleteData('transState', JSON.parse(req.query.where)).then(
        data => { res.send('data'); },
        error => { res.status(500).send('报错了') })
})



//车辆状态管理
app.get('/transStateQuerys', (req, res) => {
    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    getDatas('transState', JSON.parse(req.query.where)).then(
        data => {
            //console.log(`${req.query.flag}-/transStateQuerys-----查找到数据-${getTime()}`)
            res.send(data);
        },
        error => {
            //console.log(`${req.query.flag}-/transStateQuerys-----报错了-${getTime()}`)
            res.status(500).send('失败')
        })
})

app.get('/transStateQuery', (req, res) => {
    if (req.query.where === undefined) {
        res.status(500).send('报错了')
        return;
    }
    getData('transState', JSON.parse(req.query.where)).then(
        data => {
            if (data == null || data == '') {
                res.status(500).send("没有数据");
            }
            else {
                res.send(data);
            }

        },
        error => {
            res.status(500).send("没有数据");
        })
})


app.post('/transStateInfo', (req, res) => {
    const doc = req.body;
    insertData('transState', doc)
    res.send('添加成功')
})


//更新运输状态数据
app.post('/updateTransStateInfo', (req, res) => {
    const doc = req.body;
    updateData('transState', doc.where, doc.userInfo)
    res.send('更新成功')
})



app.listen(5000, (err) => {
    console.log('服务启动成功！')
})
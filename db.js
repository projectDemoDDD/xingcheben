
const { MongoClient } = require("mongodb");


exports.getData =(collectionNam,query)=>{
    return new Promise((resolve,reject)=>{
        const uri = 'mongodb://127.0.0.1:27017'
        const dbName = "xingcheben"
        const client = new MongoClient(uri);
        async function run() {
            try {
                const database = client.db(dbName);
                const datas = database.collection(collectionNam);
                const data = await datas.findOne(query);
                resolve(data);
            } 
            finally {await client.close();reject("报错了");}
        }

        run();

}); 

}


exports.getDatas =(collectionNam,query)=>{
    return new Promise((resolve,reject)=>{
        const uri = 'mongodb://127.0.0.1:27017'
        const dbName = "xingcheben"
        const client = new MongoClient(uri);
        async function run() {
            try {
                const database = client.db(dbName);
                const datas = database.collection(collectionNam);
                const cursor  = await datas.find(query);
                const arry=[];
                await cursor.forEach(item=>arry.push(item));
                resolve(arry);
            } 
            finally {
                await client.close();
            }
        }

        run();

}); 

}



exports.insertData =(collectionNam,data)=>{

    return new Promise((resolve,reject)=>{
        const uri = 'mongodb://127.0.0.1:27017'
        const dbName = "xingcheben"
        const client = new MongoClient(uri);
        async function run() {
            try {
                const database = client.db(dbName);
                const datas = database.collection(collectionNam);

                await datas.insertOne(data)

                resolve();
            } 
            finally {await client.close();reject();}
        }

        run();

}); 

}


exports.deleteDatas =(collectionNam,query)=>{
    return new Promise((resolve,reject)=>{
        const uri = 'mongodb://127.0.0.1:27017'
        const dbName = "xingcheben"
        const client = new MongoClient(uri);
        async function run() {
            try {
                const database = client.db(dbName);
                const datas = database.collection(collectionNam);
                await datas.deleteMany(query)
                resolve();
            } 
            catch(ex)
            { console.log(ex)}
            finally {await client.close();reject();}
        }

        run();

}); 

}



exports.deleteData =(collectionNam,query)=>{
    return new Promise((resolve,reject)=>{
        const uri = 'mongodb://127.0.0.1:27017'
        const dbName = "xingcheben"
        const client = new MongoClient(uri);
        async function run() {
            try {
                const database = client.db(dbName);
                const datas = database.collection(collectionNam);
                await datas.deleteOne(query)
                resolve();
            } 
            catch(ex)
            { console.log(ex)}
            finally {await client.close();reject();}
        }

        run();

}); 

}




exports.updateData =(collectionNam,query,data)=>{

    return new Promise((resolve,reject)=>{
        const uri = 'mongodb://127.0.0.1:27017'
        const dbName = "xingcheben"
        const client = new MongoClient(uri);
        async function run() {
            try {
                const database = client.db(dbName);
                const datas = database.collection(collectionNam);
                await datas.updateOne(query,data)
                resolve();
            } 
            catch(ex)
            { console.log(ex)}
            finally {await client.close();reject();}
        }

        run();

}); 

}

Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "S": this.getMilliseconds() //毫秒 
    };    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));    for (var k in o)        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));    return fmt;
}

exports.getTime=()=>{
    return new Date(new Date().getTime() - 1000 * 60 * 60 * 24).Format("yyyy-MM-dd hh:mm:ss")
}



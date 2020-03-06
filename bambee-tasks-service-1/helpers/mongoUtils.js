const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const MONGODB_URI = process.env.MONGODB_URI; // or Atlas connection string
const clientId = process.env.clientId;
function connect(uri) {
    console.log('=> connect to database');
    return new Promise((resolve, reject) => {

        MongoClient.connect(uri, function (err, client) {
            if (err)
                reject(err);
            else
                resolve(client.db('tasks'));

        });
    })
}

async function query(db, queryParams) {
    console.log('=> query database');
    queryParams.clientId = clientId;
    if(queryParams._id)
        queryParams._id = new objectId(queryParams._id);
    const resp = await db.collection('tasks').find(queryParams).toArray();
    console.log('mongo resp', resp);
    return resp;
}
async function insertOne(db, documents) {
    console.log('=> insert into database');
    documents.clientId = clientId;
    const resp = await db.collection('tasks').insertOne(documents);
    const id = resp.insertedId;
    return {id};
}
async function updateOne(db, document) {
    console.log('=> insert into database');
    const _id = document._id;
    delete document._id;
    const resp = await db.collection('tasks')
        .updateOne({'_id':objectId(_id)},{ $set: document});
    return {resp};
}

module.exports = {
    connect,
    query,
    insertOne,
    updateOne
};
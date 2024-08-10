import { ListCollectionsCursor, MongoClient, ObjectId } from 'mongodb';

export async function getdb(uri) {
    const client = new MongoClient(uri);
    let conn;
    try {
        conn = await client.connect();
    } catch(err) {
        console.log(err);
    }

    return conn.db("academicworld")
}

export async function getFaculty(db, name) {
    const collection = db.collection('faculty');
    var query = { name: name};
    const results = await collection.findOne(query);
    return results;
}


export async function updateUser(db, id, field, value) {
    const collection = db.collection('faculty');
    const oid = new ObjectId(id);
    const filter = {_id:oid};

    const options = { upsert:false };
    const updateQuery = {
        $set: {}
    };
    updateQuery["$set"][field] = value;
    const results = await collection.updateOne(filter, updateQuery, options);
    return results.modifiedCount;
}

async function getKeywords(db, id) {
    const collection = db.collection('faculty');
    const pipeline = [
        {$match: {id: id}},
        {$project: {"keywords.name": 1}}
    ]
    const results = await collection.aggregate(pipeline);
    var setKeywords = [];
    for await (const doc of results) {
        for (const name of doc.keywords) {
            setKeywords.push(name.name);
        }
    }
    return setKeywords
}

export async function getClosest(db, id, num) {
    const collection = db.collection('faculty');

    const keywords = await getKeywords(db, id)
    const pipeline = [
        {$match: {
            "keywords.name": {$in: keywords}
        }},
        {$unwind: "$keywords"},
        {$match: {
            "keywords.name": {$in: keywords}
        }},
        {$project: {id:1, name:1, "affiliation.name":1, "KeywordScore": "$keywords.score"},},
        {$group: {_id: {id: "$id", name: "$name", "affiliation": "$affiliation.name"}, similarity_score: {$sum: "$KeywordScore"}}},
        {$match: {"_id.id": {$ne: id}}},
        {$sort: {similarity_score:-1}},
        {$limit: num}
    ];

    const results = await collection.aggregate(pipeline);
    const closest = []
    for await (const doc of results) {
        closest.push({id: doc._id.id, name: doc._id.name, affiliation:doc._id.affiliation, similarity_score:doc.similarity_score})
    }
    return closest;
}

export async function getFiltered(db, filters) {
    const collection = db.collection('faculty')
    const pipeline = []
    for (let f of filters) {
        pipeline.push({$match : {"keywords.name" : f}});
    } 
    pipeline.push({$limit : 10});
    pipeline.push({$project: {name:1, poistion:1, email:1, keywords:1}})
    const results = await collection.aggregate(pipeline);
    const faculty = [];
    for await (const doc of results) {
        faculty.push(doc);
    }
    return faculty;
}

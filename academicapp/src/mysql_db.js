import mysql from 'mysql2/promise';

export function getdb(username, password) {
    const pool = mysql.createPool({
        host: "localhost",
        user: username,
        password: password,
        database: "academicworld",
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
    });

    console.log("mysql connected!")

    return pool;
}

async function getKeywordID(db, keyword) {
    const sql = `SELECT id FROM keyword WHERE keyword.name="${keyword}"`;
    try {
        const [rows, _] = await db.query(sql);
        const result = rows[0];
        return result.id;
    } catch (err) {
        console.error(err);
    }
}

async function completeTransaction(db, queries) {
    var connection;
    try {
        connection = await db.getConnection();
    } catch (err) {
        console.error(err);
    }
    try {
        await connection.beginTransaction();
        const queryPromises = []
        for (let q of queries) {
            queryPromises.push(connection.query(q));
        }

        const results = await Promise.all(queryPromises)
        await connection.commit();
        connection.release();
        console.log("results are");
        console.log(results);
        return results
    } catch (err) {
        console.log("transaction failed")
        console.log(err)
        await connection.rollback();
        connection.release()
        return null;
    }
} 

export async function postPublication(db, newPublication,id) {
    const keywords = newPublication.keywords;

    let splitKeywords = keywords.split(", ")
    if (keywords == '') splitKeywords = []
    const keywordScores = splitKeywords.map((pair) => {
        const separatedPair = pair.split(",");
        let keyword = separatedPair[0].substring(1);
        let scoreLength = separatedPair[1].length;
        let score = separatedPair[1].substring(0,scoreLength - 1);
        return {keyword:keyword, score: score};
    })

    for (let ks of keywordScores) {
        const keyID = await getKeywordID(db,ks.keyword);
        ks.keywordID = keyID;
    }

    console.log("ksscores")
    console.log(keywordScores)

    let queries = []
    queries.push(`SET FOREIGN_KEY_CHECKS=0`); // have to do this because data is too inconsistent from prior and so otherwise all inserts fail
    const sql = `INSERT INTO publication (ID, title, venue, year, num_citations) VALUES (${newPublication.ID}, "${newPublication.title}", "${newPublication.venue}", ${newPublication.year}, ${newPublication.num_citations})`
    queries.push(sql);
    queries.push(`INSERT INTO faculty_publication(faculty_Id, publication_Id) VALUES (${id}, ${newPublication.ID})`)
    for (let ks of keywordScores) {
        queries.push(`INSERT INTO Publication_Keyword(publication_id, keyword_id, score) VALUES (${newPublication.ID},${ks.keywordID},${ks.score})`)
    }
    console.log("queries are")
    console.log(queries)
    const results = await completeTransaction(db,queries);
    if (results) return 1;
    return -1;
}

export async function getPublications(db, id) {
    const sql = `SELECT * FROM publication WHERE ID IN (SELECT publication_Id FROM faculty_publication WHERE faculty_Id=${id}) LIMIT 10`
    try {
        const [rows, _] = await db.query(sql);
        let result = []
        for (const row of rows) {
            let pubID = row.ID
            const keysql = `SELECT name, score FROM keyword, (SELECT keyword_id, score FROM Publication_Keyword WHERE publication_id =${pubID}) as keypairs WHERE keyword.id = keypairs.keyword_id;`;
            const [keywords, _] = await db.query(keysql);
            const stringKeywords = keywords.map((pair) => { return "("+pair.name+"," + pair.score + ")"})
            const flatKeywords = stringKeywords.join(", ")
            const newRow = {...row, keywords:flatKeywords};
            result.push(newRow)
        }
        return result;
    } catch (err) {
        console.error(err);
    }
};

export async function dummy(db) {
    console.log("dummy")
    const sql = "SELECT COUNT(*) FROM faculty";
    try {
        const [rows, fields] = await db.query(sql);
        console.log(rows);
        console.log(fields);
    } catch (err) {
        console.log(err);
    }
}
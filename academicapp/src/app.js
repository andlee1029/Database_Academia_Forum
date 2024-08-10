import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import * as mongohandler from './mongo_db.js';
import * as mysqlhandler from './mysql_db.js';
import * as neo4jhandler from './neo4j_db.js';
import { config } from 'dotenv';
config();

const corsOptions = {
  origin: "http://127.0.0.1:5173",
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

const port = 5123;
const mdb = await mongohandler.getdb(process.env.MONGODB_URI);
const mysqldb = mysqlhandler.getdb(process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD)
const neo4jdb = neo4jhandler.getdb(process.env.NEO4J_URI, process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD );




app.get("/api/", async (req, res) => {
    res.send("api");
});

app.get("/api/faculty/:name", async (req, res) => {
    const name = req.params.name;
    const result = await mongohandler.getFaculty(mdb, name);
    res.json(result);
});

app.post("/api/faculty", async (req, res) => {
    const user = req.body.user;
    const field = req.body.fieldName;
    const result = await mongohandler.updateUser(mdb,user["_id"],field,user[field]);
    res.json({changed: result});
})

app.get("/api/publications/:id", async (req, res) => {
    const id = req.params.id;
    const results = await mysqlhandler.getPublications(mysqldb, id);
    res.json(results);
})

app.post("/api/publications", async (req, res) => {
    const userID = req.body.userID;
    const newPublication = req.body.publication;
    const result = await mysqlhandler.postPublication(mysqldb,newPublication,userID);
    res.json({result: result});
})

app.get("/api/closest/:id/:num", async (req, res) => {
    const id = parseInt(req.params.id);
    const num = parseInt(req.params.num);
    const result = await mongohandler.getClosest(mdb, id, num);
    res.json({result: result})
})

app.get("/api/decadePublications/:affiliation", async (req, res) => {
    const affiliation = req.params.affiliation;
    const numbers = await neo4jhandler.getDecadePublications(neo4jdb, affiliation);
    res.json({values: numbers});
});

app.get("/api/filteredFaculty/:filters?", async (req,res) => {
    const filters = req.params.filters || "";
    const splitFilters = (filters == "") ? [] : filters.split(",");
    const faculty = await mongohandler.getFiltered(mdb,splitFilters)
    res.json({faculty: faculty})
})


app.listen(port, () => {
            console.log(`academicapp has starting running on port ${port}`);
});








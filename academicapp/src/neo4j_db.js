import neo4j from 'neo4j-driver'

const URI = process.env.NEO4J_URI
const USER = process.env.NEO4J_USERNAME;


export function getdb(URI, USER, PASSWORD) {
    var driver;
    try {
        driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD), { disableLosslessIntegers: true });
        console.log("Neo4j Connection Established")
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    }
    return driver;
}

async function getNumPublications(driver, year1, year2, affiliation) {
    const { records, summary, keys } = await driver.executeQuery(
        'MATCH (i:INSTITUTE)<--(:FACULTY)-[:PUBLISH]->(p :PUBLICATION) WHERE i.name = $name AND p.year > $year AND p.year <= $year2 RETURN count(DISTINCT p) as pubCount', { name:affiliation, year:year1, year2:year2}, {database: 'academicworld'}
    )
    for (let record of records) {
        return record;
    }
}


export async function getDecadePublications(driver, affiliation) {
    let publications = []
    for (let i = 2010; i <=2020; i+= 2) {
        const num = await getNumPublications(driver,i, i+2, affiliation);
        publications.push(num);
    }
    return publications;
}
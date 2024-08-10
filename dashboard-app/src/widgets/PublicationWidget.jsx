import styles from "./styles/PublicationWidget.module.css"
import { useEffect, useState } from "react";

const url = "http://localhost:5123/api/publications/"

async function getPublications(id, update) {
    const get_url = url + id;
    var result;
    try {
        const response = await fetch(get_url);
        if (!response.ok) {
            throw new Error(`getPublications: ${response.status}`)
        }

        result = await response.json();
        console.log("publications are");
        console.log(result)
        update(result);
    } catch (err) {
        console.error(err.message);
    }
}

function AddPublication({ userID, update }) {
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [venue, setVenue] = useState('');
    const [year, setYear] = useState('');
    const [numCit, setNumCit] = useState('');
    const [keywords, setKeywords] = useState('');
    const [pubID, setpubID] = useState('');

    const clickClose = () => {
        setAdding('');
        setTitle('');
        setVenue('');
        setYear('');
        setNumCit('');
        setKeywords('');
        setpubID('');
        setAdding(false);
    };

    const clickAdd = async () => {
        const newPublication = {
            ID: pubID,
            title: title,
            venue: venue,
            keywords: keywords,
            year: year,
            num_citations: numCit
        }
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json")
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({publication: newPublication, userID:userID}),
            headers: headers
            });
            const respBody = await response.json();
            const result = respBody.result;
            if (result == -1) throw new Error("click add: database failed");

            update(newPublication);
            setpubID('');
            setAdding('');
            setTitle('');
            setVenue('');
            setYear('');
            setNumCit('');
            setKeywords('');
            setAdding(false);
            alert("New publication added!")
        } catch (err) {
            console.error(err);
            setAdding('');
            setpubID('');
            setTitle('');
            setVenue('');
            setYear('');
            setNumCit('');
            setKeywords('');
            setAdding(false);
            alert("New publication failed to add!")
        }
        
        
    };

    let addForm = (
        <div className={styles.addForm}>
            Add Publication
            <label>
                ID:{' '}
                <input value={pubID} onChange={(e) => setpubID(e.target.value)}/>
            </label>
            <label>
                Title:{' '}
                <input value={title} onChange={(e) => setTitle(e.target.value)}/>
            </label>
            <label>
                Venue:{' '}
                <input value={venue} onChange={(e) => setVenue(e.target.value)}/>
            </label>
            <label>
                Year:{' '}
                <input value={year} onChange={(e) => setYear(e.target.value)}/>
            </label>
            <label>
                Number of Citations:{' '}
                <input value={numCit} onChange={(e) => setNumCit(e.target.value)}/>
            </label>
            <label>
                Keywords:{' '}
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
            </label>
            <div>
                <button className={styles.formButton + " " + styles.add} onClick={clickAdd}>add</button>
                <button className={styles.formButton + " close"} onClick={clickClose}>close</button>
            </div>
        </div>
    );

    let addButton = (
        <div className={styles.addButton}><button onClick={() => setAdding(true)}>Add Publication</button></div>
    );

    return (
        <>{adding ? addForm : addButton}</>
    );
}

function MyPublications({ id, publications, update }) {

    useEffect(() => {
        if (id != null) getPublications(id, update);
    }, [id]);

    const pubElements = publications.map((pub) => {
        return (
            <div className={styles.publication}>
                <div className={styles.pubField}><h3 className={styles.fieldName}>ID:</h3> <p>{pub.ID}</p></div>
                <div className={styles.pubField}><h3 className={styles.fieldName}>Title:</h3> <p>{pub.title}</p></div>
                <div className={styles.pubField}><h3 className={styles.fieldName}>Venue:</h3> <p>{pub.venue}</p></div>
                <div className={styles.pubField}><h3 className={styles.fieldName}>Year:</h3> <p>{pub.year}</p></div>
                <div className={styles.pubField}><h3 className={styles.fieldName}>Number of Citations:</h3> <p>{pub.num_citations}</p></div>
                <div className={styles.pubField}><h3 className={styles.fieldName}>Keyword Score Pairs:</h3> <p>{pub.keywords}</p></div>
            </div>
        )
    });

    return (
        <div className={styles.myPublications}>
            {pubElements}
        </div>
    );
}

export default function PublicationWidget({ userID }) {
    const [publications, setPublications] = useState([]);
    const updatePublications = (newPub) => {
        setPublications([...publications, newPub])
    }

    return (
        <div className={styles.publicationWidget}>
            <div className={ styles.title }><h2>My Publications</h2></div>
            <MyPublications id={userID} publications={publications} update={setPublications}/>
            <AddPublication userID={userID} update={updatePublications}/>
        </div>
    );
}
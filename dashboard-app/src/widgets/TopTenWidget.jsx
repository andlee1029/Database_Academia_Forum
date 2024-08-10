import styles from './styles/TopTenWidget.module.css';
import { useEffect, useState } from "react";

const url = 'http://localhost:5123/api/closest/'

function TopTen({ id }) {
    const [topTen, setTopTen] = useState([])


    useEffect(() => {
        let ignore = false;
        if (id != null) {
            fetch(url + id + "/10")
                .then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        setTopTen(json.result);
                    }
                })
        } 

        return () => {
            ignore = true;
        };
    }, [id]);

    let peopleMap = topTen.map((person) => {
        return (
            <li>
                <h3>{person.name}</h3>
                <p>Affiliation: {person.affiliation}</p>
                <p>Similarity Score: {person.similarity_score}</p>
            </li>
        )
    })

    return (
        <ol className={styles.toplist}>
            {peopleMap}
        </ol>
    );
}

export default function TopTenWidget({ userID }) {

    return (
        <div className={styles.TopTenWidget}>
            <div className={styles.title}><h2>Top Ten Most Similar Faculty</h2></div>
            <TopTen id={userID}/>
        </div>
    )
}
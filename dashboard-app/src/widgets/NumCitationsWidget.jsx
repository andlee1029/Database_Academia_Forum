import { useEffect, useState } from "react";
import styles from './styles/NumCitationsWidget.module.css'

const api = 'http://localhost:5123/api/filteredFaculty/'

export default function NumCitationsWidget() {
    const [filters, setFilters] = useState([]);
    const [people, setPeople] = useState([])
    const [input, setInput] = useState('')

    const handleClick = () => {
        const filter = input;
        setFilters([...filters, filter]);
        setInput('');
    }
    
    useEffect(() => {
        let ignore = false;
        const filtersString = filters.join(",");
        fetch(api + filtersString)
            .then(response => response.json())
            .then(json => {
                if(!ignore) {
                    console.log("reponse is")
                    console.log(json.faculty)
                    setPeople(json.faculty)
                }
            })

        return () => {
            ignore = true;
        }
    }, [filters]);

    let peopleMap = people.map((person) => { return (
        <li>
            <h3>{person.name}</h3>
            <p>Affiliation: {person.affiliation}</p>
            <p>Email: {person.email}</p>
            <p>Keywords: {person.keywords.map((k) => {return k.name}).join(", ")}</p>
        </li>
    )})

    return (
        <div className={styles.NumCitationsWidget}>
            <div className={styles.title}><h2>Find Faculty by Keyword</h2></div>
            <ol className={styles.list}>
                { peopleMap }
            </ol>
            <div className={ styles.entry }>
                <input className={ styles.input } type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
                <button onClick={handleClick}>Add</button>
            </div>
        </div>
    );
};
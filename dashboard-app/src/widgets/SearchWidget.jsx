import styles from './styles/SearchWidget.module.css'
import { useEffect, useState } from 'react'

const api_url = 'http://localhost:5123/api/faculty/'

function FacultyProfile({ name }) {
    const [person, setPerson] = useState({})

    useEffect(() => {
        let ignore = false;
        
        if (name) {
            fetch(api_url + name)
                .then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        console.log("person is")
                        console.log(json)
                        setPerson(json)
                    }
                })
        }
        return () => {
            ignore = true;
        };
    }, [name])

    return (
        <div className={styles.FacultyProfile}>
            {!person? (<></>) :
                <div>
                    <img src={person.photoUrl}/>
                    <p>Name: {person.name}</p>
                    <p>Affiliation: {person.affiliation ? person.affiliation.name : ''}</p>
                    <p>Position: {person.position}</p>
                    <p>Email: {person.email}</p>
                    <p>Phone: {person.phone}</p>
                    <p>Research Interest: {person.name}</p>
                </div> 
            }
        </div>
    )
}

export default function SearchWidget( ) {
    const [input, setInput] = useState('');
    const [name, setName] = useState('');

    const handleClick = () => {
        setName((input ? input : ""));
        setInput('')
    };

    return (
        <div className={styles.searchwidget}>
            <div className={styles.title}><h2>Search</h2></div>
            <div className={ styles.entry }>
                <FacultyProfile name={name} />
                <input className={ styles.input } type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
                <button onClick={handleClick}>Search Name</button>
            </div>
        </div>
    )
}
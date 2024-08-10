import styles from './styles/NumPublicationsWidget.module.css'
import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from "react-chartjs-2";

const api_url = 'http://localhost:5123/api/decadePublications/'

export default function NumPublicationsWidget ({ affiliationName }) {
    const [myData, setMyData] = useState([0,0,0,0,0]);
    const [input, setInput] = useState("");
    const [aName, setAName] = useState(affiliationName)

    const handleClick = () => {
        setAName(input);
        setInput('');
    }

    useEffect(() => {
        let ignore = false;
        if (affiliationName) {
            fetch(api_url + affiliationName)
            .then(response => response.json())
            .then(json => {
                if (!ignore) {
                    setMyData(json.values);
                }
            });
        }
        return () => {
            ignore = true;
        };
    }, [aName]);

    return (
        <div className={styles.NumPublicationsWidget}> 
            <div className={styles.title}><h2>Compare Publications by Affiliation</h2></div>
            <Bar data={{
                labels: ["2010-12","2012-14","2014-16", "2016-18", "2018-20"],
                datasets: [
                    {
                        label: `Publications by ${aName}`,
                        data: myData
                    }
                ]
            }}/>
            <div className={ styles.entry }>
                <input className={ styles.input } type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
                <button onClick={handleClick}>Add</button>
            </div>
        </div>
    )
}
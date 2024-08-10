import styles from "./styles/ProfileWidget.module.css"
import { useState } from "react";

const api_url = "http://localhost:5123/api/faculty/";
const fieldNames = ["name", "position", "researchInterest", "email", "phone", "affiliation"];
const fieldNamesMap = {
    "name": "Name",
    "position": "Position",
    "researchInterest": "Research Interests",
    "email": "Email",
    "phone": "Phone Number",
    "affiliation": "Affiliation Name",
}

function Entry({ fieldName, value, update }) {
    const [updating, setUpdating] = useState(false);
    const [input, setInput] = useState((value ? value : ''));

    const clickEdit = () => {
        setUpdating(true);
    }

    const clickSave = () => {
        update(fieldName, input);
        setUpdating(false);
        setInput('');
    }

    const inputChange = (e) => {
        setInput(e.target.value);
    }

    let normalForm = (
        <div className={ styles.entry }>
            <p>{ value ? value : "None" }</p>
            <button className={ styles.button } onClick={clickEdit}>edit</button>
        </div>
    );

    let updateForm = (
        <div className={styles.entry}>
            <input className={ styles.input } type="text" value={input} onChange={inputChange}/>
            <button className={ styles.button + " " + styles.save } onClick={clickSave}>save</button>
            <button className={ styles.button + " " + styles.close } onClick={() => {setUpdating(false); setInput('')}}>close</button>
        </div>
    );

    return (
        <>{ updating ? updateForm : normalForm }</>
    );
}

export default function ProfileWidget({ user, updateUser }) {
    const update = async (fName,value) => {
        const newUser = {...user};
        newUser[fName] = value;

        const headers = new Headers();
        headers.append("Content-Type", "application/json")
        const response = await fetch(api_url, {
            method: "POST",
            body: JSON.stringify({user: newUser, fieldName: fName}),
            headers: headers
        });
        const result = await response.json();
        updateUser(newUser);
    };

    const fieldMarkups = fieldNames.map((fName) => {
        let val = ((fName in user) && (user[fName])) ? user[fName] : null;
        if (val && fName == "affiliation") {
            val = user[fName].name;
        }
        return (
            <div className={styles.field}>
                <h3 className={styles.fieldName}>{ fieldNamesMap[fName] }:</h3>
                <Entry fieldName={fName} value={val} update={update} />
            </div>
        )
    })

    return (
        <div className={ styles.ProfileWidget }>
            <div className={ styles.title }><h2>Profile</h2></div>
            { fieldMarkups }
        </div>
    )
}
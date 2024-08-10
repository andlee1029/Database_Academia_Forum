import { useEffect, useState } from 'react';
import ProfileWidget from './widgets/ProfileWidget';
import PublicationWidget from './widgets/PublicationWidget';
import TopTenWidget from './widgets/TopTenWidget';
import SearchWidget from './widgets/SearchWidget';
import NumPublicationsWidget from './widgets/NumPublicationsWidget'
import NumCitationsWidget from './widgets/NumCitationsWidget';
import './App.css';

async function getUser(name, setUser) {
  const url = "http://localhost:5123/api/faculty/" + name;
  var result;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Resp stat: ${response.status}`)
    }
    result = await response.json();
    setUser(result);
  } catch (err) {
    console.error(err.message);
  }
}

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser("Agouris,Peggy", setUser);
  }, []);

  return (
    <div className='app'>
      <ProfileWidget user={user} updateUser={setUser} />
      <PublicationWidget userID={user.id} />
      <TopTenWidget userID={user.id}/>
      <SearchWidget />
      <NumPublicationsWidget affiliationName={user.affiliation? user.affiliation["name"] : ""}/>
      <NumCitationsWidget />
    </div>
  )
}

export default App;

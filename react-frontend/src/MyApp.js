import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Table from './Table';
import Form from './Form';

function MyApp() {
  const [characters, setCharacters] = useState([]); 

  async function removeOneCharacter(index) {
    const response = await axios.delete('http://localhost:8000/users/' + characters[index].id);
    const updated = characters.filter((character, i) => {
      return i !== index
    });
    setCharacters(updated);
  }
  
  async function fetchAll(){
    try {
       const response = await axios.get('http://localhost:8000/users');
       return response.data.users_list;     
    }
    catch (error){
      //We're not handling errors. Just logging into the console.
      console.log(error); 
      return false;         
    }
  }
  
  async function makePostCall(person){
    try {
      const response = await axios.post('http://localhost:8000/users', person);
      // if (response.status === 201) {
      //   const updatedPerson = response.data; // #3 get the updated person object from the response 
      //   setCharacters([...characters, updatedPerson]);
      // }
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }
  
  function updateList(person) { 
    makePostCall(person).then( result => {
    if (result && result.status === 201) // #1 implemented 201 status code
      setCharacters([...characters, result.data] );
    });
 }

  useEffect(() => {
    fetchAll().then( result => {
      if (result)
          setCharacters(result);
    });
  }, [] );

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  )
}

export default MyApp;
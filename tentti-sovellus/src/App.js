import './App.css';
import Tentti from './Tentti'
import React, {useState} from 'react';

const App = () => {
  const[tenttiNumero, setTentti] = useState(0);

  let yKysymys1 = {kysymys: "Kumpi ja Kampi tappeli. Kumpi voitti?", vastaukset: ["Kumpi", "Kampi", "Kumpikin"]}
  let yKysymys2 = {kysymys: "Kumpi painaa enemmän, kilo höyheniä vai kilo kiviä?", vastaukset: ["Kivet", "Höyhenet", "Painavat saman verran"] }
  let bKysymys1 = {kysymys: "Minkä väristä on virtahevon hiki?", vastaukset: ["Sinistä", "Punaista", "Kirkasta"] }
  let bKysymys2 = {kysymys: "Montako vähintään 500 neliömetrin kokoista järveä on Suomessa?", vastaukset: ["n. 57 000", "n. 168 000", "en ole laskenut"]}

  let tentti1 = {nimi:"Yleistentti",
                kysymystenMäärä:12,
                kysymykset:[yKysymys1, yKysymys2]
                }

  let tentti2 = {nimi:"Biologian tentti",
                kysymystenMäärä:10,
                kysymykset:[bKysymys1, bKysymys2]
                }

  let tentit = [tentti1, tentti2]
  

  return (
    <div>
      <div className='App-header'>
        <div className='Single-item'> Tenttien määrä: {tentit.length} </div>
        <button className='Single-item' onClick = {() => setTentti(0)}>{tentti1.nimi} </button>
        <button className='Single-item' onClick = {() => setTentti(1)}>{tentti2.nimi} </button>
      </div>
      
      <div className='Body'>
        <div> <Tentti tentti = {tentit[tenttiNumero]}/> </div> 
      </div>
    </div>
  );
}

export default App;

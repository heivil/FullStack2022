import './App.css';
import Tentti from './Tentti'
import React, {useState} from 'react';

const App = () => {
  const[tenttiNumero, setTentti] = useState(0);

  let kysymys1 = {kysymys: "Kumpi ja Kampi tappeli. Kumpi voitti?", vastaukset: ["Kumpi", "Kampi", "Kumpikin"]}
  let kysymys2 = {kysymys: "Kumpi painaa enemmän, kilo höyheniä vai kilo kiviä?", vastaukset: ["Kivet", "Höyhenet", "Painavat saman verran"] }
  let kysymys3 = {kysymys: "Montako vähintään 500 neliömetrin kokoista järveä on Suomessa?", vastaukset: ["n. 57 000", "n. 168 000", "en ole laskenut"]}
  let kysymys4 = {kysymys: "Minkä väristä on virtahevon hiki?", vastaukset: ["Sinistä", "Punaista", "Kirkasta"] }
  let kysymys5 = {kysymys: "Paljonko on 100 + 100", vastaukset: ["200", "500", "69 höhö"] }
  let kysymys6 = {kysymys: "Kumpi tuli ensin, muna vai kana?", vastaukset: ["Kana", "Muna", "Yhtäaikaa"] }
  

  let tentti1 = {nimi:"Tentti 1",
                kysymystenMäärä:3,
                kysymykset:[kysymys1, kysymys2, kysymys3]
                }

  let tentti2 = {nimi:"Tentti 2",
                kysymystenMäärä:3,
                kysymykset:[kysymys4, kysymys5, kysymys6]
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

import './App.css';
import Tentti from './Tentti'


const App = () => {

  let kysymys1 = {kysymys:"Kumpi ja Kampi tappeli. Kumpi voitti?", vastaukset: ["Kumpi", "Kampi", "Kumpikin"]}
  let kysymys2 = {kysymys:"Kumpi painaa enemmän, kilo höyheniä vai kilo kiviä?", vastaukset: ["Kivet", "Höyhenet", "Painavat saman verran"] }
  let kysymys3 = {kysymys:"Minkä väristä on virtahevon hiki?", vastaukset: ["Sinistä", "Punaista", "Kirkasta"] }


  let tentti1 = {nimi:"Yleistentti",
                kysymystenMäärä:12,
                kysymykset:[kysymys1, kysymys2]
                }

  let tentti2 = {nimi:"Biologian tentti",
                kysymystenMäärä:10,
                kysymykset:[kysymys3]
                }

  let tentit = [tentti1, tentti2]
  

  return (
    <div>
      <div className='App-header'>
        <div className='Single-item'> Tenttien määrä: {tentit.length} </div>
        <button className='Single-item'>{tentti1.nimi}</button>
        <button className='Single-item'>{tentti2.nimi}</button>
      </div>
      
      <div className='App'>
        <div> <Tentti tentti = {tentit[0]}/> </div> 
      </div>
    </div>
  );
}

export default App;

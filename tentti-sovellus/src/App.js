import './App.css';
import Tentti from './Tentti';
import React, {useState, useReducer, useEffect } from 'react';
import { act } from 'react-dom/test-utils';

const App = () => {
  const[tenttiNumero, setTenttiNumero] = useState(0);
  const[tallennetaanko, setTallennetaanko] = useState(false);
  const[tietoAlustettu, setTietoAlustettu] = useState(false);
  const[opettajaMoodi, setOpettajaMoodi] = useState(false)
  
  let kysymys1 = {kysymys: "Kumpi ja Kampi tappeli. Kumpi voitti?", vastaukset: ["Kumpi", "Kampi", "Kumpikin"]}
  let kysymys2 = {kysymys: "Kumpi painaa enemmän, kilo höyheniä vai kilo kiviä?", vastaukset: ["Kivet", "Höyhenet", "Painavat saman verran"] }
  let kysymys3 = {kysymys: "Montako vähintään 500 neliömetrin kokoista järveä on Suomessa?", vastaukset: ["n. 57 000", "n. 168 000", "en ole laskenut"]}
  let kysymys4 = {kysymys: "Paljonko painaa teelusikallinen neutronitähteä Maan pinnalla?", vastaukset: ["Noin miljardi tonnia", "Auton verran", "En ole varma, googlesta saa monta eri vastausta"] }
  let kysymys5 = {kysymys: "Paljonko on 100 + 100", vastaukset: ["200", "500", "69 höhö"] }
  let kysymys6 = {kysymys: "Kumpi tuli ensin, muna vai kana?", vastaukset: ["Kana", "Muna", "Yhtäaikaa"] }
  

  let tentti1 = {nimi:"Eka tentti",
                kysymykset:[kysymys1, kysymys2, kysymys3]
                }

  let tentti2 = {nimi:"Toka tentti",
                kysymykset:[kysymys4, kysymys5, kysymys6]
                }

  let _tentit = [tentti1, tentti2]
  
  const[tentit, dispatch] = useReducer(reducer, _tentit);

  function reducer(state, action) {
    switch (action.type) {
       case 'VASTAUS_MUUTTUI':
        const muutettuVastaus = action.payload.vastaus
        const tentitKopio1 = JSON.parse(JSON.stringify({...state}))
        tentitKopio1[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex] = muutettuVastaus
        return tentitKopio1;
      case 'KYSYMYS_MUUTTUI':
        const muutettuKysymys = action.payload.kysymys
        const tentitKopio2 = JSON.parse(JSON.stringify({...state}))
        tentitKopio2[tenttiNumero].kysymykset[action.payload.kysymysIndex].kysymys = muutettuKysymys  
        return tentitKopio2;
      case 'POISTA_KYSYMYS':
        const tentitKopio3 = JSON.parse(JSON.stringify({...state}))
        const kysymyksetKopio = tentitKopio3[tenttiNumero].kysymykset.filter(kysymys => 
          kysymys !== tentitKopio3[tenttiNumero].kysymykset[action.payload.kysymysIndex])
        tentitKopio3[tenttiNumero].kysymykset = kysymyksetKopio      
        return tentitKopio3;
      case 'POISTA_VASTAUS':
        const tentitKopio4 = JSON.parse(JSON.stringify({...state}))
        const vastauksetKopio = tentitKopio4[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
          vastaus !== tentitKopio4[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        tentitKopio4[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        return tentitKopio4;
      case 'LISÄÄ_KYSYMYS':
        const tentitKopio5 = JSON.parse(JSON.stringify({...state}))
        const uusiKysymys = {kysymys: "Uusi kysymys", vastaukset: ["Uusi vastaus"]}
        tentitKopio5[tenttiNumero].kysymykset.push(uusiKysymys)
        return tentitKopio5;
      case 'LISÄÄ_VASTAUS':
        const tentitKopio6 = JSON.parse(JSON.stringify({...state}))
        const uusiVastaus = "Uusi vastaus"; 
        tentitKopio6[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)
        return tentitKopio6;
      case 'PÄIVITÄ_TALLENNUSTILA':
        setTallennetaanko(action.payload)
        return { ...state}
      case 'ALUSTA_DATA':
        setTietoAlustettu(true)
        setTenttiNumero(action.payload.tenttiNumero)
        setOpettajaMoodi(action.payload.opettajaMoodi)
        return {...state}
      default:
        throw new Error("Reduceriin tultiin oudosti.");
    }
  }

  useEffect(() => {
    //localStorage.clear();
    const ladattuData = localStorage.getItem('tenttiData'); 
    
    if (ladattuData == null) {
      const tallennettavaData = {
        ...tentit,
        tenttiNumero,
        opettajaMoodi,
        tietoAlustettu
      }
      console.log("Data luettiin vakiosta")
      localStorage.setItem('tenttiData', JSON.stringify(tallennettavaData));
      dispatch({ type: "ALUSTA_DATA", payload: tallennettavaData })
    } else {
      console.log("Data luettiin local storagesta")
      dispatch({ type: "ALUSTA_DATA", payload: (JSON.parse(ladattuData)) })
    }

  }, []);
  
  useEffect(() => {
    const tallennettavaData = {
      ...tentit,
      tenttiNumero,
      opettajaMoodi,
      tietoAlustettu
    }
    if (tallennetaanko === true) {
      console.log("Muutos pitää tallentaa")     
      localStorage.setItem('tenttiData', JSON.stringify(tallennettavaData));
      dispatch({ type: "PÄIVITÄ_TALLENNUSTILA", payload: tallennettavaData })
    }
  }, [tallennetaanko, tentit, tenttiNumero, opettajaMoodi, tietoAlustettu]);
  
  return (
    <div className='Screen'>
      <div className='App-header'>
        <div> Tentit: {tentit.length} </div>
        <button className='Nappi' onClick = {() => setTenttiNumero(0)}>{tentti1.nimi} </button>
        <button className='Nappi' onClick = {() => setTenttiNumero(1)}>{tentti2.nimi} </button>
        <button className='Nappi' onClick = {() => setOpettajaMoodi(!opettajaMoodi)}>{opettajaMoodi ? "Oppilasmoodiin" : "Opettajamoodiin"} </button>
      </div>
      
      <div className='Main-content'>
        <div> {tietoAlustettu && <Tentti tentti = {tentit[tenttiNumero]} moodi={opettajaMoodi} dispatch = {dispatch}/>} </div> 
        <button className='Nappi' onClick={() => {dispatch({type: 'PÄIVITÄ_TALLENNUSTILA', payload:true})}}>Tallenna tiedot</button>
      </div>
    </div>
  );
}

export default App;

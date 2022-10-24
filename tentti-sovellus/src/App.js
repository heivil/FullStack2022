import './App.css';
import Tentti from './Tentti';
import React, {useState, useReducer, useEffect} from 'react';

const App = () => {
  const[tenttiNumero, setTenttiNumero] = useState(0);
  const[tallennetaanko, setTallennetaanko] = useState(false);
  const[tietoAlustettu, setTietoAlustettu] = useState(false);
  const[opettajaMoodi, setOpettajaMoodi] = useState(false);
  
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
  const[ajastin, setAjastin] = useState()
  const[ekaRender, setEkaRender] = useState(true)

  function ajoitettuVaroitus(){
    clearTimeout(ajastin)
    setAjastin(setTimeout(function(){ alert("Hälytys, tallenna välillä."); }, 3000));
  }

  function lopetaAjastin(){
    console.log("Lopetetaan ajastin")
    clearTimeout(ajastin)
  }

  function reducer(state, action) {
    const tentitKopio = JSON.parse(JSON.stringify(state))
    switch (action.type) {
       case 'VASTAUS_MUUTTUI':
        const muutettuVastaus = action.payload.vastaus
        tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex] = muutettuVastaus
        return tentitKopio;
      case 'KYSYMYS_MUUTTUI':
        const muutettuKysymys = action.payload.kysymys
        tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex].kysymys = muutettuKysymys  
        return tentitKopio;
      case 'POISTA_KYSYMYS':
        const kysymyksetKopio = tentitKopio[tenttiNumero].kysymykset.filter(kysymys => 
          kysymys !== tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex])
        tentitKopio[tenttiNumero].kysymykset = kysymyksetKopio      
        return tentitKopio;
      case 'POISTA_VASTAUS':
        const vastauksetKopio = tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
          vastaus !== tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        return tentitKopio;
      case 'LISÄÄ_KYSYMYS':
        const uusiKysymys = {kysymys: "Uusi kysymys", vastaukset: ["Uusi vastaus"]}
        tentitKopio[tenttiNumero].kysymykset.push(uusiKysymys)
        return tentitKopio;
      case 'LISÄÄ_VASTAUS':
        const uusiVastaus = "Uusi vastaus"; 
        tentitKopio[tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)        
        return tentitKopio;
      case 'PÄIVITÄ_TALLENNUSTILA':
        setTallennetaanko(action.payload)
        //lopetaAjastin()
        return tentitKopio;
      case 'ALUSTA_DATA':
        setTietoAlustettu(true)
        setTenttiNumero(action.payload.tenttiNumero)
        setOpettajaMoodi(action.payload.opettajaMoodi)
        const tentitKopio2 = action.payload.tentitKopsu
        return tentitKopio2;
      default:
        throw new Error("Reduceriin tultiin oudosti.");
    }
  }

  useEffect(() => {
    //localStorage.clear();
    const ladattuData = localStorage.getItem('tenttiData'); 
    
    if (ladattuData == null) {
      const tallennettavaData = { ///tämä kokonaan setStateen
      tentitKopsu: JSON.parse(JSON.stringify(tentit)),
      tenttiNumero,
      opettajaMoodi,
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
    
    if(ekaRender === false){
      console.log("tentit muuttui")
      ajoitettuVaroitus()
    }
    setEkaRender(false)
    
  },[tentit])
  
  useEffect(() => {
    const tallennettavaData = { ///tämä kokonaan setStateen
      tentitKopsu: JSON.parse(JSON.stringify(tentit)),
      tenttiNumero,
      opettajaMoodi,
    }
    if (tallennetaanko === true) {
      console.log("Muutos tallennetaan")     
      localStorage.setItem('tenttiData', JSON.stringify(tallennettavaData));
      dispatch({ type: "PÄIVITÄ_TALLENNUSTILA", payload: false })
    }
    lopetaAjastin()
  }, [tallennetaanko]);

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
        <button className='Nappi' onClick={() => {lopetaAjastin()}}>Lopeta ajastin</button>
      </div>
    </div>
  );
}

export default App;

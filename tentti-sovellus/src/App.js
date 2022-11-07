import './App.css';
import Tentti from './Tentti';
import React, {useState, useReducer, useEffect} from 'react';
import axios from 'axios'
import KirjauduRuutu from './Kirjaudu';

const App = () => {

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
  
  const[data, dispatch] = useReducer(reducer, {tentit: _tentit, tenttiNumero: 0, tallennetaanko: false, tietoAlustettu: false, 
    opettajaMoodi: false, ensimmäinenKierros: true, kirjauduttu: false, kirjauduRuutu: true, tallennettavaData:{}, käyttäjät:[]});
  const[ajastin, setAjastin] = useState()

  function ajoitettuVaroitus(){
    clearTimeout(ajastin)
    !data.kirjauduRuutu && data.opettajaMoodi && setAjastin(setTimeout(function(){ alert("Hälytys, tallenna välillä."); }, 3000));
  }

  function lopetaAjastin(){
    console.log("Lopetetaan ajastin")
    clearTimeout(ajastin)
  }

  function reducer(state, action) {
    const dataKopio = JSON.parse(JSON.stringify(state))
    switch (action.type) {
       case 'VASTAUS_MUUTTUI':
        const muutettuVastaus = action.payload.vastaus
        dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex] = muutettuVastaus
        return dataKopio;
      case 'KYSYMYS_MUUTTUI':
        const muutettuKysymys = action.payload.kysymys
        dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex].kysymys = muutettuKysymys  
        return dataKopio;
      case 'POISTA_KYSYMYS':
        const kysymyksetKopio = dataKopio.tentit[state.tenttiNumero].kysymykset.filter(kysymys => 
          kysymys !== dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex])
        dataKopio.tentit[state.tenttiNumero].kysymykset = kysymyksetKopio      
        return dataKopio;
      case 'POISTA_VASTAUS':
        const vastauksetKopio = dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
          vastaus !== dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        return dataKopio;
      case 'LISÄÄ_KYSYMYS':
        const uusiKysymys = {kysymys: "Uusi kysymys", vastaukset: ["Uusi vastaus"]}
        dataKopio.tentit[state.tenttiNumero].kysymykset.push(uusiKysymys)
        return dataKopio;
      case 'LISÄÄ_VASTAUS':
        const uusiVastaus = "Uusi vastaus"; 
        dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)        
        return {...state, tentit: dataKopio.tentit};
      case 'PÄIVITÄ_TALLENNUSTILA':
        return {...state, tallennetaanko: action.payload};
      case 'ASETA_TALLENNETTAVA_DATA':
        return {...state, tallennettavaData: action.payload}
      case 'ALUSTA_DATA':
        return {...state, tentit: action.payload.tentit, tietoAlustettu: true, 
          tenttiNumero: action.payload.tenttiNumero, opettajaMoodi: action.payload.opettajaMoodi, käyttäjät:action.payload.käyttäjät};
      case 'MUUTA_TENTTINUMERO':
        return {...state, tenttiNumero: action.payload}
      case 'MUUTA_MOODI':
        return{...state, opettajaMoodi: action.payload}
      case 'EKA_KIERROS_OHI':
        return{...state, ensimmäinenKierros: false}
      case 'KIRJAUDU':
        
        let kirjaudutaanko = false;
        let kirjautuja={tunnus: "", salasana: "", admin: false};
        for(let i = 0; i<state.käyttäjät.length; i++){
          if(state.käyttäjät[i].tunnus === action.payload.tunnus && state.käyttäjät[i].salasana === action.payload.salasana){
            kirjaudutaanko = true
            kirjautuja = state.käyttäjät[i]
            break;
          }        
        }
        if(kirjaudutaanko === false) alert("Väärä tunnus tai salasana.");
        return{...state, kirjauduttu: kirjaudutaanko, opettajaMoodi:kirjautuja.admin}
      case 'REKISTERÖIDY':
        console.log(state.käyttäjät)
        const uusiKäyttäjä = {tunnus: action.payload.tunnus, salasana:action.payload.salasana, admin:action.payload.admin}
        let tunnusVapaana = true
        for(let i = 0; i<state.käyttäjät.length; i++){
          if(state.käyttäjät[i].tunnus === action.payload.tunnus) tunnusVapaana = false
        }
        if(tunnusVapaana){
          let käyttäjätKopio = JSON.parse(JSON.stringify(state.käyttäjät))
          käyttäjätKopio.push(uusiKäyttäjä)
          return{...state, käyttäjät: käyttäjätKopio, tallennetaanko: true}
        }else{
          alert("Tunnus on jo varattu.");
          return{...state}
        }
      case 'KIRJAUDU_RUUTU':
        return{...state, kirjauduRuutu: action.payload}
      default:
        throw new Error("Reduceriin tultiin oudosti.");
    }
  }

  useEffect(() => {
    const getData = async () => {
      try{
        const result = await axios('http://localhost:8080');
        console.log("Alustus result:", result.data)
        dispatch({ type: 'ALUSTA_DATA', payload: result.data })
      }catch(error){
        console.log("Virhe alustaessa: ",error)
      }
    }
    getData() 
    
  }, []);

  useEffect(() => {
    if(!data.ensimmäinenKierros){ 
      console.log("tentit muuttui")
      ajoitettuVaroitus()
    }else {
      dispatch({type: 'EKA_KIERROS_OHI'})
    }
  },[data.tentit])
  
  useEffect(() => {

    const saveData = async () => {
      
      try {
        const uusiTallennettavaData = { 
          tentit: data.tentit,
          tenttiNumero: data.tenttiNumero,
          opettajaMoodi: data.opettajaMoodi,
          käyttäjät: data.käyttäjät
        }
        
        console.log("Muutos tallennetaan", uusiTallennettavaData)
        dispatch({type: 'ASETA_TALLENNETTAVA_DATA', payload: uusiTallennettavaData})
        const result = await axios.post('http://localhost:8080', {data: data.tallennettavaData})
        dispatch({ type: 'PÄIVITÄ_TALLENNUSTILA', payload: false })
      } catch (error) {
        console.log("Virhe tallennettaessa",error)
      }
    }
    if (data.tallennetaanko === true) {
      saveData()
    } 
  }, [data.tallennetaanko]);

  return (
    <div className='Screen'>
      {data.kirjauduttu && 
      <div className='App-header'>
        <div> Tenttejä: {data.tentit.length} </div>
        <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_TENTTINUMERO', payload:0})}>{tentti1.nimi} </button>
        <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_TENTTINUMERO', payload:1})}>{tentti2.nimi} </button>
        {/* <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_MOODI', payload:!data.opettajaMoodi})}>{data.opettajaMoodi ? "Oppilasmoodiin" : "Opettajamoodiin"} </button> */}
      </div>}
      {!data.kirjauduttu && 
      <div className='App-header'>
        <button className='Nappi' onClick = {() => dispatch({type:'KIRJAUDU_RUUTU', payload:true})}>Kirjaudu</button>
        <button className='Nappi' onClick = {() => dispatch({type:'KIRJAUDU_RUUTU', payload:false})}>Rekisteröidy</button>
        <button className='Nappi' onClick = {() => {}}>Tietoa sovelluksesta</button>
      </div>}
      
      {data.kirjauduttu &&
      <div className='Main-content'>
        <div> {data.tietoAlustettu && <Tentti tentti = {data.tentit[data.tenttiNumero]} moodi={data.opettajaMoodi} dispatch = {dispatch}/>} </div> 
        {data.opettajaMoodi && <button className='Nappi' onClick={() => {dispatch({type: 'PÄIVITÄ_TALLENNUSTILA', payload:true}); lopetaAjastin()}}>Tallenna tiedot</button>}
      </div>}
      {!data.kirjauduttu &&
      <div className='Main-content'>
        <div> {data.tietoAlustettu && <KirjauduRuutu kirjaudu = {data.kirjauduRuutu} dispatch = {dispatch}/>} </div> 
      
      </div>}
    </div>
  );
}

export default App;

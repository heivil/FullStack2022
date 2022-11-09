import './App.css';
import Tentti from './Tentti';
import React, {useState, useReducer, useEffect} from 'react';
import axios from 'axios'
import KirjauduRuutu from './Kirjaudu';

const App = () => {

  let defaultTentti = {ten_nimi:"Default tentti", kysymykset:[{kys_nimi: "Kysymys", id: 0, vastaukset: [{vas_nimi: "Vastaus 1", kysymys_id: 0}]}]}
  
  //tietoalustettu, kirjauduttu ja opettajamoodi on true testausta varten. älä unohda!***********************************************************************
  const[data, dispatch] = useReducer(reducer, {tentti: defaultTentti, tenttiNumero: 0, tallennetaanko: false, tietoAlustettu: true, 
    opettajaMoodi: true, ensimmäinenKierros: true, kirjauduttu: true, kirjauduRuutu: true, tallennettavaData:{}, käyttäjät:[]});
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
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vas_nimi = muutettuVastaus
        return dataKopio;
      case 'KYSYMYS_MUUTTUI':
        const muutettuKysymys = action.payload.kys_nimi
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].kys_nimi = muutettuKysymys  
        return dataKopio;
      case 'POISTA_KYSYMYS':
        const kysymyksetKopio = dataKopio.tentit[state.tenttiNumero].kysymykset.filter(kys_nimi => 
          kys_nimi !== dataKopio.tentit[state.tenttiNumero].kysymykset[action.payload.kysymysIndex])
        dataKopio.tentti.kysymykset = kysymyksetKopio      
        return dataKopio;
      case 'POISTA_VASTAUS':
        const vastauksetKopio = dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
          vastaus !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        return dataKopio;
      case 'LISÄÄ_KYSYMYS':
        const uusiKysymys = {kys_nimi: "Uusi kysymys", id: 0, vastaukset: [{vas_nimi: "Uusi vastaus", kysymys_id:0}]}//kysymysid pitää saada kysymykseltä
        dataKopio.tentti.kysymykset.push(uusiKysymys)
        return dataKopio;
      case 'LISÄÄ_VASTAUS':
        const uusiVastaus = {vas_nimi: "Uusi vastaus", kysymys_id:0}; //kysymysid pitää saada kysymykseltä
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)        
        return {...state, tentti: dataKopio.tentti};
      case 'PÄIVITÄ_TALLENNUSTILA':
        return {...state, tallennetaanko: action.payload};
      case 'ASETA_TALLENNETTAVA_DATA':
        return {...state, tallennettavaData: action.payload}
      case 'ALUSTA_DATA':
        return {...state, tentti: action.payload, tietoAlustettu: true, 
          /* tenttiNumero: action.payload.tenttiNumero, opettajaMoodi: action.payload.opettajaMoodi, käyttäjät:action.payload.käyttäjät */};
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
        const result = await axios('http://localhost:8080/lataa');
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
      console.log("tentti muuttui")
      ajoitettuVaroitus()
    }else {
      dispatch({type: 'EKA_KIERROS_OHI'})
    }
  },[data.tentti])
  
  useEffect(() => {

    const saveData = async () => {
      
      try {
        const uusiTallennettavaData = { 
          tentti: data.tentti,
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
        {/* <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_TENTTINUMERO', payload:0})}>{data.tentti.ten_nimi} </button> */}
        {/* <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_TENTTINUMERO', payload:1})}>{tentti2.ten_nimi} </button> */}
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
        <div> {data.tietoAlustettu && <Tentti tentti = {data.tentti} moodi={data.opettajaMoodi} dispatch = {dispatch}/>} </div> 
        {data.opettajaMoodi && <button className='Nappi' onClick={() => 
          {dispatch({type: 'PÄIVITÄ_TALLENNUSTILA', payload:true}); lopetaAjastin()}}>Tallenna tiedot</button>}
      </div>}
      {!data.kirjauduttu &&
      <div className='Main-content'>
        <div> {data.tietoAlustettu && <KirjauduRuutu kirjaudu = {data.kirjauduRuutu} dispatch = {dispatch}/>} </div> 
      
      </div>}
    </div>
  );
}

export default App;

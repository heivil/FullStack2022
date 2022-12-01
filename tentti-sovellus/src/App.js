import './App.css';
import Tentti from './Tentti';
import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios'
import KirjauduRuutu from './Kirjaudu';
import DBG from './DBG.png';
import BG from './BG.png';

//useref --> siirtää fokuksen tiettyyn komponenttiin esim tekstikenttä yms

const App = () => {

  /*   const defaultTentti = { ten_nimi: "Default tentti", kysymykset: [{ kys_nimi: "Kysymys", id: 0, vastaukset: [{ vas_nimi: "Vastaus 1", kysymys_id: 0 }] }] }
    const defaultKäyttäjä = { käyttäjätunnus: "", salasana: "", tentti_id: 0, onko_admin: false } */

  const [data, dispatch] = useReducer(reducer, {
    tentit: {}, tentti: {}, tallennetaanko: false, opettajaMoodi: true, tenttiNäkymä: false, kirjauduRuutu: true, 
    muutettuData: { tentit: [], kysymykset: [], vastaukset: [] },
    lisättyData: { tentit: [], kysymykset: [], vastaukset: [] }, 
    poistettuData: { tentit: [], kysymykset: [], vastaukset: [] }, token: '', darkMode: false
  });

  const [ajastin, setAjastin] = useState()

  function ajoitettuVaroitus() {
    clearTimeout(ajastin)
    !data.kirjauduRuutu && data.opettajaMoodi && setAjastin(setTimeout(function () { alert("Hälytys, tallenna välillä."); }, 3000));
    //TODO:laita tallentamaan tässä suoraan?
  }

  function lopetaAjastin() {
    console.log("Lopetetaan ajastin")
    clearTimeout(ajastin)
  }

  function reducer(state, action) {
    const dataKopio = JSON.parse(JSON.stringify(state))
    switch (action.type) {
      case 'VASTAUS_MUUTTUI':

          dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vas_nimi = action.payload.vas_nimi
          //tarkistetaan onko muutettujen vastausten listalla jo sama vastaus, jos ei pushataan listaan, jos on niin muutetaan vain vas_nimi
          if (!dataKopio.muutettuData.vastaukset.some(vas => vas.id === action.payload.id)) {
            dataKopio.muutettuData.vastaukset.push(dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
          } else {
            dataKopio.muutettuData.vastaukset.some(vas => vas.id === action.payload.id && (vas.vas_nimi = action.payload.vas_nimi))
          }
        return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

      case 'KYSYMYS_MUUTTUI':

        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].kys_nimi = action.payload.kys_nimi
        if (!dataKopio.muutettuData.kysymykset.some(kys => kys.id === action.payload.id)) {
          dataKopio.muutettuData.kysymykset.push(dataKopio.tentti.kysymykset[action.payload.kysymysIndex])
        } else {
          dataKopio.muutettuData.kysymykset.some(kys => kys.id === action.payload.id && (kys.kys_nimi = action.payload.kys_nimi))
        }
        return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

      case 'TENTTI_MUUTTUI':
        dataKopio.tentti.ten_nimi = action.payload.ten_nimi
        if (!dataKopio.muutettuData.tentit.some(ten => ten.id === action.payload.id)) {
          dataKopio.muutettuData.tentit.push(dataKopio.tentti)
        } else {
          dataKopio.muutettuData.tentit.some(ten => ten.id === action.payload.id && (ten.id = action.payload.id))
        }
        return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

      case 'POISTA_KYSYMYS':

        const kysymyksetKopio = dataKopio.tentti.kysymykset.filter(kysymys =>
        kysymys !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex])
        dataKopio.tentti.kysymykset = kysymyksetKopio
        dataKopio.poistettuData.kysymykset.push(action.payload.kysymys)
        //poistetaan poistettu kysymys muutetut ja lisätyt listalta
        dataKopio.lisättyData.kysymykset = dataKopio.lisättyData.kysymykset.filter(kys => kys.id !== action.payload.kysymys.id)
        dataKopio.muutettuData.kysymykset = dataKopio.muutettuData.kysymykset.filter(kys => kys.id !== action.payload.kysymys.id)
        return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData, lisättyData: dataKopio.lisättyData };

      case 'POISTA_VASTAUS':

        const vastauksetKopio = dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
        vastaus !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        dataKopio.poistettuData.vastaukset.push(action.payload.vastaus)
        //poistetaan poistettu kysymys muutetut ja lisätyt listalta
        dataKopio.lisättyData.vastaukset = dataKopio.lisättyData.vastaukset.filter(vas => vas.id !== action.payload.vastaus.id)
        dataKopio.muutettuData.vastaukset = dataKopio.muutettuData.vastaukset.filter(vas => vas.id !== action.payload.vastaus.id)
        return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData, lisättyData: dataKopio.lisättyData };

      case 'POISTA_TENTTI':

        const tentitKopio = dataKopio.tentit.tenttiLista.filter(tentti => tentti !== dataKopio.tentit[action.payload.tenttiIndex])
        dataKopio.tentit.tenttiLista = tentitKopio
        dataKopio.poistettuData.tentit.push(action.payload)
        //vaihda staten tentti johonkin toiseen
        return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData, tentit: dataKopio.tentit, tallennetaanko: true};

      case 'LISÄÄ_TENTTI':
        
        const uusiTentti = { ten_nimi: "Uusi tentti"}
        dataKopio.lisättyData.tentit.push(uusiTentti)
        dataKopio.tentti = uusiTentti //staten tentiksi pitää asettaa tietokannasta saatu tentti
        console.log("tentti lisätty: ")
        return { ...state, tentti: dataKopio.tentti, lisättyData: dataKopio.lisättyData, tallennetaanko: true };

      case 'LISÄÄ_KYSYMYS':

        const uusiKysymys = { kys_nimi: "Uusi kysymys", tentti_id: action.payload.tentti_id, vastaukset:[] }
        dataKopio.lisättyData.kysymykset.push(uusiKysymys)
        dataKopio.tentti.kysymykset.push(uusiKysymys)
        console.log("kysymys lisätty", dataKopio.tentti)
        return { ...state, tentti: dataKopio.tentti, lisättyData: dataKopio.lisättyData, tallennetaanko: true };

      case 'LISÄÄ_VASTAUS':
        
        console.log("lisätään vastausta", action.payload)
        //korjaa pisteet ja onko oikein uusiVastauksessa !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const uusiVastaus = { vas_nimi: "Uusi vastaus", kysymys_id: action.payload.kysymys_id, pisteet: 0, onko_oikein: false };
        console.log("ksysymy",dataKopio.tentti.kysymykset[action.payload.kysymysIndex])
        if(dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset === undefined){
          dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = []
        }
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)
        dataKopio.lisättyData.vastaukset.push(uusiVastaus)
        return { ...state, lisättyData: dataKopio.lisättyData, tentti: dataKopio.tentti, tallennetaanko: true };

      case 'VAIHDA_TENTTI':

        console.log("tentti vaihtuu", action.payload.id)
        return { ...state, tenttiNumero: action.payload.id}

      case 'PÄIVITÄ_TALLENNUSTILA':

        return { ...state, tallennetaanko: action.payload };

      case 'TYHJENNÄ_MUUTOKSET':

        const tyhjäMuutosObj = { tentit: [], kysymykset: [], vastaukset: [] }
        return { ...state, muutettuData: tyhjäMuutosObj, poistettuData: tyhjäMuutosObj, lisättyData: tyhjäMuutosObj }

      case 'ALUSTA_DATA':

        return {...state, tentti: action.payload.tentti, tentit: action.payload.tentit, tietoAlustettu: true,};

      case 'KIRJAUDU_RUUTU':

        return { ...state, kirjauduRuutu: action.payload }

      case 'VAIHDA_TENTTINÄKYMÄ':

        return { ...state, tenttiNäkymä: action.payload.tenttiNäkymä, token: action.payload.token }

      case 'DARK_MODE':

          return{...state, darkMode: action.payload}

      default:
        throw new Error("Reduceriin tultiin oudosti.");
    }
  }

  useEffect(() => {

    if(data.muutettuData.tentit.length > 0 || data.muutettuData.kysymykset > 0 || data.muutettuData.vastaukset > 0 || 
       data.poistettuData.kysymykset > 0 || data.poistettuData.vastaukset > 0)
      {
        console.log("tenteissä muutoksia")
        ajoitettuVaroitus()
      }
  }, [data.muutettuData, data.poistettuData]) 

  useEffect(() => {
    const saveData = () => {
      try {
        console.log("Muutokset tallennetaan")
        välitäMuutokset(data.lisättyData, data.muutettuData, data.poistettuData)
        dispatch({ type: 'PÄIVITÄ_TALLENNUSTILA', payload: false })
        dispatch({ type: 'TYHJENNÄ_MUUTOKSET' })
      } catch (error) {
        console.log("Virhe tallennettaessa", error)
      }
    }
    if (data.tallennetaanko === true) {
      saveData()
    }
  }, [data.tallennetaanko]);

  const välitäMuutokset = async (lisätty, muutettu, poistettu) => {
    console.log("lis", lisätty, "muu", muutettu, "pois", poistettu)
    if (lisätty.tentit.length > 0) {
      for (let i = 0; i < lisätty.tentit.length; i++) {
        await axios.post(`https://localhost:8080/lisaaTentti/nimi/${lisätty.tentit[i].ten_nimi}/min_pisteet/10`)//täällä hard koodattu 10 pistemääräksi!!!
        await getData(data.token, 0) //koska tentti vasta lisättiin haetaan uusin tentti argumentilla 0
      }
    }

    if (lisätty.kysymykset.length > 0) {
      for (let i = 0; i < lisätty.kysymykset.length; i++) {
        await axios.post(`https://localhost:8080/lisaaKysymys/kysymys/${lisätty.kysymykset[i].kys_nimi}/tentti/${lisätty.kysymykset[i].tentti_id}`)
      }
      await getData(data.token, data.tentti.id) 
    }

    if (lisätty.vastaukset.length > 0) {
      for (let i = 0; i < lisätty.vastaukset.length; i++) {
        await axios.post(`https://localhost:8080/lisaaVastaus/vastaus/${lisätty.vastaukset[i].vas_nimi}/kysymys_id/${lisätty.vastaukset[i].kysymys_id}/pisteet/${lisätty.vastaukset[i].pisteet}/onko_oikein/${lisätty.vastaukset[i].onko_oikein}`)
      }
      await getData(data.token, data.tentti.id) 
    }

    if (muutettu.tentit.length > 0) {
      for (let i = 0; i < muutettu.tentit.length; i++) {
        await axios.put(`https://localhost:8080/muutaTentti/id/${muutettu.tentit[i].id}/nimi/${muutettu.tentit[i].ten_nimi}`)
      }
    }

    if (muutettu.kysymykset.length > 0) {
      for (let i = 0; i < muutettu.kysymykset.length; i++) {
        await axios.put(`https://localhost:8080/muutaKysymys/id/${muutettu.kysymykset[i].id}/kys_nimi/${muutettu.kysymykset[i].kys_nimi}`)
      }
    }

    if (muutettu.vastaukset.length > 0) {
      for (let i = 0; i < muutettu.vastaukset.length; i++) {
        await axios.put(`https://localhost:8080/muutaVastaus/id/${muutettu.vastaukset[i].id}/vas_nimi/${muutettu.vastaukset[i].vas_nimi}/kysymys_id/${muutettu.vastaukset[i].kysymys_id}/pisteet/${muutettu.vastaukset[i].pisteet}/onko_oikein/${muutettu.vastaukset[i].onko_oikein}`)
      }
    }

    if (poistettu.kysymykset.length > 0) {
      for (let i = 0; i < poistettu.kysymykset.length; i++) {
        await axios.delete(`https://localhost:8080/poistaKysymys/id/${poistettu.kysymykset[i].id}`)
      }
    }

    if (poistettu.vastaukset.length > 0) {
      for (let i = 0; i < poistettu.vastaukset.length; i++) {
        await axios.delete(`https://localhost:8080/poistaVastaus/id/${poistettu.vastaukset[i].id}`)
      }
    }

    if (poistettu.tentit.length > 0) { 
      for (let i = 0; i < poistettu.tentit.length; i++) {
        await axios.delete(`https://localhost:8080/poistaTentti/id/${poistettu.tentit[i].id}`)
        await getData(data.token, 0) //koska tentti poistettiin, heataan uusin tentti argumentilla 0
      }
    }
    
  }

  const getData = async (token, tentti_id) => {
    try {                                                                                     //tallenna token localstorageen
      const resTentti = await axios.get(`https://localhost:8080/tentti/id/${tentti_id}/token/${token}`);
      const resTentit = await axios.get(`https://localhost:8080/tentit/token/${token}`);
      console.log("Alustus result:", resTentti.data, resTentit.data)
      dispatch({ type: 'ALUSTA_DATA', payload: { tentti: resTentti.data, tentit: resTentit.data } })
    } catch (error) {
      console.log("Virhe alustaessa: ", error)
    }
  }

  const kirjauduSisään = async (käyttäjä) => {
    try {
      const result = await axios.get(`https://localhost:8080/kirjaudu/tunnus/${käyttäjä.tunnus}/salasana/${käyttäjä.salasana}`);
      if (result) {
        dispatch({ type: 'VAIHDA_TENTTINÄKYMÄ', payload: { tenttiNäkymä: true, token: result.data.data.token } })
        console.log("kirjaudu result:", result.data)
        getData(result.data.data.token, result.data.data.tentti_id) 
      }
    } catch (err) {
      console.log("Virhe kirjautuessa", err)
    }
  }

  const rekisteröiUusi = async (käyttäjä) => {
    try {
      const result = await axios.post(`https://localhost:8080/rekisteroi/tunnus/${käyttäjä.tunnus}/salasana/${käyttäjä.salasana}/onko_admin/${käyttäjä.onko_admin}`);
      console.log("Rekisteröinti result:", result.data)
    } catch (err) {
      console.log("Virhe rekisteröidessä", err)
    }
  }

  const vaihdaTeema = () => {
    
    if(!data.darkMode){
      document.querySelector(':root').style.setProperty('--bg', `url(${DBG})`)
      document.querySelector(':root').style.setProperty('--fontColor', 'white')
      dispatch({type: 'DARK_MODE', payload:true})
    } else {
      document.querySelector(':root').style.setProperty('--bg', `url(${BG})`)
      document.querySelector(':root').style.setProperty('--fontColor', `black`)
      dispatch({type: 'DARK_MODE', payload:false})
    }
  }

  return (
    <div>
      {data.tenttiNäkymä &&
        <div className='App-header'>
          {data.tentit.tenttiLista !== undefined && <div className="dropdown">
            <button className="dropbtn">Tentit</button>
            <div className="dropdown-content">
              {data.tentit.tenttiLista.map((tent) => 
                <a onClick={() => 
                getData(data.token, tent.id)} //data.token täällä vielä!!!
                key={tent.id}>{tent.ten_nimi}</a>)}
            </div>
          </div>}
          <button className="Nappi" onClick={()=> dispatch({type: 'LISÄÄ_TENTTI', payload:{} })}>Lisää tentti</button>
          <button className="Nappi" onClick={()=> 
          {
            if(window.confirm("Haluatko varmasti poistaa koko tentin? Poiston jälkeen sitä ei voi palauttaa.")) { 
              dispatch({type: 'POISTA_TENTTI', payload:data.tentti })
            }
            }}>Poista tentti</button>
          <button className="Nappi" onClick={()=> vaihdaTeema()}>{data.darkMode ? 'Light Mode' : 'Dark Mode' }</button>
        </div>}
      {!data.tenttiNäkymä &&
        <div className='App-header'>
          <button className='Nappi' onClick={() => dispatch({ type: 'KIRJAUDU_RUUTU', payload: true })}>Kirjaudu</button>
          <button className='Nappi' onClick={() => dispatch({ type: 'KIRJAUDU_RUUTU', payload: false })}>Rekisteröidy</button>
          <button className='Nappi' onClick={() => { }}>Tietoa sovelluksesta</button>
          <button className="Nappi" onClick={()=> vaihdaTeema()}>{data.darkMode ? 'Light Mode' : 'Dark Mode' }</button>
        </div>}

      {data.tenttiNäkymä &&
        <div className='Main-content'>
          <div> {data.tietoAlustettu && <Tentti tentti={data.tentti} moodi={data.opettajaMoodi} dispatch={dispatch} />} </div>
          {data.opettajaMoodi && <button className='Nappi' onClick={() => { dispatch({ type: 'PÄIVITÄ_TALLENNUSTILA', payload: true }); lopetaAjastin() }}>Tallenna tiedot</button>}
        </div>}
      {!data.tenttiNäkymä &&
        <div className='Main-content'>
          <div> {<KirjauduRuutu kirjaudu={data.kirjauduRuutu} kirjauduSisään={kirjauduSisään} rekisteröiUusi={rekisteröiUusi} />} </div>

        </div>}
    </div>
  );
}

export default App;

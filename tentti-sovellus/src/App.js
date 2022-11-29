import './App.css';
import Tentti from './Tentti';
import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios'
import KirjauduRuutu from './Kirjaudu';

//useref --> siirtää fokuksen tiettyyn komponenttiin esim tekstikenttä yms

const App = () => {

  /*   const defaultTentti = { ten_nimi: "Default tentti", kysymykset: [{ kys_nimi: "Kysymys", id: 0, vastaukset: [{ vas_nimi: "Vastaus 1", kysymys_id: 0 }] }] }
    const defaultKäyttäjä = { käyttäjätunnus: "", salasana: "", tentti_id: 0, onko_admin: false } */

  const [data, dispatch] = useReducer(reducer, {
    tentit: {}, tentti: {}, tallennetaanko: false, opettajaMoodi: true, tenttiNäkymä: false,
    kirjauduRuutu: true, käyttäjä: {}, muutettuData: { tentit: [], kysymykset: [], vastaukset: [] },
    lisättyData: { tentit: [], kysymykset: [], vastaukset: [] }, poistettuData: { tentit: [], kysymykset: [], vastaukset: [] }, token: ''
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

        let muutettuVastaus = action.payload.vastaus
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vas_nimi = action.payload.vas_nimi //nimi tulee vähän oudosti erillään koko objektista event.target.valuen takia  
        //tarkistetaan onko muutettujen vastausten listalla jo sama vastaus, jos ei pushataan listaan, jos on niin muutetaan vain vas_nimi
        if (!dataKopio.muutettuData.vastaukset.some(vas => vas.id === muutettuVastaus.id)) {
          dataKopio.muutettuData.vastaukset.push(muutettuVastaus)
        } else {
          dataKopio.muutettuData.vastaukset.some(vas => vas.id === muutettuVastaus.id && (vas.vas_nimi = muutettuVastaus.vas_nimi))
        }
        return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

      case 'KYSYMYS_MUUTTUI':

        let muutettuKysymys = action.payload.kysymys
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].kys_nimi = action.payload.kys_nimi
        if (!dataKopio.muutettuData.kysymykset.some(kys => kys.id === muutettuKysymys.id)) {
          dataKopio.muutettuData.kysymykset.push(muutettuKysymys)
        } else {
          dataKopio.muutettuData.kysymykset.some(kys => kys.id === muutettuKysymys.id && (kys.kys_nimi = muutettuKysymys.kys_nimi))
        }
        return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

      case 'TENTTI_MUUTTUI':

        const muutettuTentti = action.payload.tentti
        dataKopio.tentti.ten_nimi = action.payload.ten_nimi
        if (!dataKopio.muutettuData.tentit.some(ten => ten.id === muutettuTentti.id)) {
          dataKopio.muutettuData.tentit.push(muutettuTentti)
        } else {
          dataKopio.muutettuData.tentit.some(ten => ten.id === muutettuTentti.id && (ten.ten_nimi = muutettuTentti.ten_nimi))
        }
        return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

      case 'POISTA_KYSYMYS':

        const kysymyksetKopio = dataKopio.tentti.kysymykset.filter(kysymys =>
          kysymys !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex])
        dataKopio.tentti.kysymykset = kysymyksetKopio
        dataKopio.poistettuData.kysymykset.push(action.payload.kysymys)
        return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData };

      case 'POISTA_VASTAUS':

        const vastauksetKopio = dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
          vastaus !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        dataKopio.poistettuData.vastaukset.push(action.payload.vastaus)
        return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData };

      case 'POISTA_TENTTI':

        const tentitKopio = dataKopio.tentit.tenttiLista.filter(tentti => tentti !== dataKopio.tentit[action.payload.tenttiIndex])
        dataKopio.tentit.tenttiLista = tentitKopio
        dataKopio.poistettuData.tentit.push(action.payload)
        //vaihda staten tentti johonkin toiseen
        return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData };

      case 'LISÄÄ_TENTTI':
        
        const uusiTentti = { ten_nimi: "Uusi tentti", kysymykset: [{ kys_nimi: "Kysymys", id: 0, vastaukset: [{ vas_nimi: "Vastaus 1", kysymys_id: 0 }] }]}
        dataKopio.lisättyData.tentit.push(uusiTentti)
        dataKopio.tentti = uusiTentti
        console.log("tentti lisätty: ", dataKopio.tentti)
        return { ...state, tentti: dataKopio.tentti, lisättyData: dataKopio.lisättyData };

      case 'LISÄÄ_KYSYMYS':

        const uusiKysymys = { kys_nimi: "Uusi kysymys", tentti_id: action.payload.tentti_id, vastaukset:[] }
        dataKopio.lisättyData.kysymykset.push(uusiKysymys)
        dataKopio.tentti.kysymykset.push(uusiKysymys)
        console.log("kysymys lisätty", dataKopio.tentti)
        return { ...state, tentti: dataKopio.tentti, lisättyData: dataKopio.lisättyData };

      case 'LISÄÄ_VASTAUS':

        //korjaa pisteet ja onko oikein uusiVastauksessa !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const uusiVastaus = { vas_nimi: "Uusi vastaus", kysymys_id: action.payload.kysymys_id, pisteet: 0, onko_oikein: false };
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)
        dataKopio.lisättyData.vastaukset.push(uusiVastaus)
        return { ...state, lisättyData: dataKopio.lisättyData, tentti: dataKopio.tentti };

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

      default:
        throw new Error("Reduceriin tultiin oudosti.");
    }
  }

  useEffect(() => {
    if (data.poistettuData.tentit.length > 0) {
      getData(data.token, 1) //todo: token ei datasta ja tentti id joku muu kuin aina 1. 
    }else{
      console.log("tenteissä muutoksia")
      ajoitettuVaroitus()
    }
  }, [data.muutettuData, data.lisättyData, data.poistettuData]) 

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
      }
    }

    if (lisätty.kysymykset.length > 0) {
      for (let i = 0; i < lisätty.kysymykset.length; i++) {
        await axios.post(`https://localhost:8080/lisaaKysymys/kysymys/${lisätty.kysymykset[i].kys_nimi}/tentti/${lisätty.kysymykset[i].tentti_id}`)
      }
    }

    if (lisätty.vastaukset.length > 0) {
      for (let i = 0; i < lisätty.vastaukset.length; i++) {
        await axios.post(`https://localhost:8080/lisaaVastaus/vastaus/${lisätty.vastaukset[i].vas_nimi}/kysymys_id/${lisätty.vastaukset[i].kysymys_id}/pisteet/${lisätty.vastaukset[i].pisteet}/onko_oikein/${lisätty.vastaukset[i].onko_oikein}`)
      }
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

    if (poistettu.tentit.length > 0) { 
      for (let i = 0; i < poistettu.tentit.length; i++) {
        await axios.delete(`https://localhost:8080/poistaTentti/id/${poistettu.tentit[i].id}`)
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
    console.log(käyttäjä)
    try {
      const result = await axios.post(`https://localhost:8080/rekisteroi/tunnus/${käyttäjä.tunnus}/salasana/${käyttäjä.salasana}/onko_admin/${käyttäjä.onko_admin}`);
      console.log("Rekisteröinti result:", result.data)
    } catch (err) {
      console.log("Virhe rekisteröidessä", err)
    }
  }

  return (
    <div className='Screen'>
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
          <button className="Nappi" onClick={(event)=> dispatch({type: 'LISÄÄ_TENTTI', payload:{} })}>Lisää tentti</button>
          <button className="Nappi" onClick={(event)=> dispatch({type: 'POISTA_TENTTI', payload:data.tentti })}>Poista tentti</button>
        </div>}
      {!data.tenttiNäkymä &&
        <div className='App-header'>
          <button className='Nappi' onClick={() => dispatch({ type: 'KIRJAUDU_RUUTU', payload: true })}>Kirjaudu</button>
          <button className='Nappi' onClick={() => dispatch({ type: 'KIRJAUDU_RUUTU', payload: false })}>Rekisteröidy</button>
          <button className='Nappi' onClick={() => { }}>Tietoa sovelluksesta</button>
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

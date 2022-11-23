import './App.css';
import Tentti from './Tentti';
import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios'
import KirjauduRuutu from './Kirjaudu';

const App = () => {

/*   const defaultTentti = { ten_nimi: "Default tentti", kysymykset: [{ kys_nimi: "Kysymys", id: 0, vastaukset: [{ vas_nimi: "Vastaus 1", kysymys_id: 0 }] }] }
  const defaultKäyttäjä = { käyttäjätunnus: "", salasana: "", tentti_id: 0, onko_admin: false } */

  const [data, dispatch] = useReducer(reducer, {
    tentti: {}, tenttiNumero: 1, tallennetaanko: false, tietoAlustettu: false,
    opettajaMoodi: true, ensimmäinenKierros: true, tenttiNäkymä: false, kirjauduRuutu: true, käyttäjä: {}, uusiKäyttäjä: {}, 
    muutettuData: { tentit: [], kysymykset: [], vastaukset: [] }, lisättyData: { tentit: [], kysymykset: [], vastaukset: [] },
    poistettuData: { tentit: [], kysymykset: [], vastaukset: [] }, token: ''
  });

  const [ajastin, setAjastin] = useState()

  function ajoitettuVaroitus() {
    clearTimeout(ajastin)
    !data.kirjauduRuutu && data.opettajaMoodi && setAjastin(setTimeout(function () { alert("Hälytys, tallenna välillä."); }, 3000));
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
        muutettuVastaus.vas_nimi = action.payload.vas_nimi
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vas_nimi = muutettuVastaus.vas_nimi
        //tarkistetaan onko muutettujen vastausten listalla jo sama vastaus, jos ei pushataan listaan, jos on niin muutetaan vain vas_nimi
        if (!dataKopio.muutettuData.vastaukset.some(vas => vas.id === muutettuVastaus.id)) {
          dataKopio.muutettuData.vastaukset.push(action.payload.vastaus)
        }else{
          dataKopio.muutettuData.vastaukset.some(vas => vas.id === muutettuVastaus.id && (vas.vas_nimi = muutettuVastaus.vas_nimi))
        }
        return {...state, muutettuData: dataKopio.muutettuData};

      case 'KYSYMYS_MUUTTUI':

        const muutettuKysymys = action.payload.kysymys
        muutettuKysymys.kys_nimi = action.payload.kys_nimi
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].kys_nimi = muutettuKysymys.kys_nimi
        if (!dataKopio.muutettuData.kysymykset.some(kys => kys.id === muutettuKysymys.id)) {
          dataKopio.muutettuData.kysymykset.push(action.payload.kysymys)
        }else{
          dataKopio.muutettuData.kysymykset.some(kys => kys.id === muutettuKysymys.id && (kys.kys_nimi = muutettuKysymys.kys_nimi))
        }
        return {...state, muutettuData: dataKopio.muutettuData};

      case 'POISTA_KYSYMYS':

        const kysymyksetKopio = dataKopio.tentti.kysymykset.filter(kysymys =>
          kysymys !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex])
        dataKopio.tentti.kysymykset = kysymyksetKopio
        dataKopio.poistettuData.kysymykset.push(action.payload.kysymys)
        return {...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData};

      case 'POISTA_VASTAUS':

        const vastauksetKopio = dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
          vastaus !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
        dataKopio.poistettuData.vastaukset.push(action.payload.vastaus)
        return {...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData};

      case 'LISÄÄ_KYSYMYS':

        const uusiKysymys = {kys_nimi: "Uusi kysymys", tentti_id: action.payload.tentti_id}
        dataKopio.lisättyData.kysymykset.push(uusiKysymys)
        dataKopio.tentti.kysymykset.push(uusiKysymys)
        console.log(dataKopio.tentti)
        return {...state, tentti:dataKopio.tentti, lisättyData: dataKopio.lisättyData};

      case 'LISÄÄ_VASTAUS':

        //korjaa pisteet ja onko oikein uusiVastauksessa !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const uusiVastaus = { vas_nimi: "Uusi vastaus", kysymys_id: action.payload.kysymys_id, pisteet:0, onko_oikein: false }; 
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)
        dataKopio.lisättyData.vastaukset.push(uusiVastaus)
        return {...state, lisättyData: dataKopio.lisättyData , tentti: dataKopio.tentti};

      case 'PÄIVITÄ_TALLENNUSTILA':

        return {...state, tallennetaanko: action.payload};

      case 'TYHJENNÄ_MUUTOKSET':

        const tyhjäMuutosObj = { tentit: [], kysymykset: [], vastaukset: []}
        return {...state, muutettuData: tyhjäMuutosObj, poistettuData: tyhjäMuutosObj, lisättyData: tyhjäMuutosObj}

      case 'ALUSTA_DATA':

        return {
          ...state, tentti: action.payload, tietoAlustettu: true,
          /* tenttiNumero: action.payload.tenttiNumero, opettajaMoodi: action.payload.opettajaMoodi, käyttäjät:action.payload.käyttäjät */
          };

      case 'MUUTA_TENTTINUMERO':

        return {...state, tenttiNumero: action.payload}

      case 'MUUTA_MOODI':

        return {...state, opettajaMoodi: action.payload}

      case 'EKA_KIERROS_OHI':

        return {...state, ensimmäinenKierros: false}

      case 'KIRJAUDU':

        let kirjautuja = {tunnus: action.payload.tunnus, salasana: action.payload.salasana}
        return {...state, käyttäjä: kirjautuja}

      case 'REKISTERÖIDY':

        let uusi = { tunnus: action.payload.tunnus, salasana: action.payload.salasana, onko_admin: action.payload.admin }
        return {...state, uusiKäyttäjä: uusi}

      case 'KIRJAUDU_RUUTU':

        return {...state, kirjauduRuutu: action.payload}

      case 'VAIHDA_TENTTINÄKYMÄ':

        return {...state, tenttiNäkymä: action.payload.tenttiNäkymä, token: action.payload.token}

      default:
        throw new Error("Reduceriin tultiin oudosti.");
    }
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axios.get(`https://localhost:8080/tentti/id/${data.tenttiNumero}/token/${data.token}`); 
        console.log("Alustus result:", result.data)
        dispatch({ type: 'ALUSTA_DATA', payload: result.data })
      } catch (error) {
        console.log("Virhe alustaessa: ", error)
      }
    }
    if(!data.ensimmäinenKierros){
      getData()
    }else{
      dispatch({ type: 'EKA_KIERROS_OHI' })
    }

  }, [data.tenttiNäkymä]);

  useEffect(() => {
    if (!data.ensimmäinenKierros) {
      console.log("tentti muuttui")
      ajoitettuVaroitus()
    } else {
      dispatch({ type: 'EKA_KIERROS_OHI' })
    }
  }, [data.tentti])

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

  useEffect(() => {
    const rekisteröiUusi = async () => {
      try{
        console.log(data.uusiKäyttäjä)                  //tentti_id on aina tässä 1 tällä hetkellä
        const result = await axios.post(`https://localhost:8080/rekisteroi/tunnus/${data.uusiKäyttäjä.tunnus}/salasana/${data.uusiKäyttäjä.salasana}/tentti_id/1/onko_admin/${data.uusiKäyttäjä.onko_admin}`);
        console.log("Rekisteröinti result:", result.data)
      }catch(err){
        console.log("Virhe rekisteröidessä")
      }
    }

    if(!data.ensimmäinenKierros){
      rekisteröiUusi()
    }
  }, [data.uusiKäyttäjä])

  useEffect(() => {
    const kirjauduSisään = async () => {
      try{
        const result = await axios.get(`https://localhost:8080/kirjaudu/tunnus/${data.käyttäjä.tunnus}/salasana/${data.käyttäjä.salasana}`);
        if(result){
          dispatch({type:'VAIHDA_TENTTINÄKYMÄ', payload: {tenttiNäkymä: true, token: result.data.data.token}})   
          console.log("kirjaudu result:", result.data)
        }
      }catch(err){
        console.log("Virhe kirjautuessa")
      }
    }

    if(!data.ensimmäinenKierros){
      kirjauduSisään()
    }
  }, [data.käyttäjä])

  const välitäMuutokset = async (lisätty, muutettu, poistettu) => {
    console.log("lis",lisätty,"muu", muutettu, "pois", poistettu)
    if (lisätty.tentit.length > 0) {
      await axios.post(`https://localhost:8080/`)
    }

    if (lisätty.kysymykset.length > 0) {
      for(let i = 0; i < lisätty.kysymykset.length; i++){
        await axios.post(`https://localhost:8080/lisaaKysymys/kysymys/${lisätty.kysymykset[i].kys_nimi}/tentti/${lisätty.kysymykset[i].tentti_id}`)
      }
    }

    if (lisätty.vastaukset.length > 0) {
      for(let i = 0; i < lisätty.vastaukset.length; i++){
        await axios.post(`https://localhost:8080/lisaaVastaus/vastaus/${lisätty.vastaukset[i].vas_nimi}/kysymys_id/${lisätty.vastaukset[i].kysymys_id}/pisteet/${lisätty.vastaukset[i].pisteet}/onko_oikein/${lisätty.vastaukset[i].onko_oikein}`)
      }
    }

    if (muutettu.tentit.length > 0) {
      await axios.put(`https://localhost:8080/`)
    }

    if (muutettu.kysymykset.length > 0) {
      for(let i = 0; i < muutettu.kysymykset.length; i++){
        await axios.put(`https://localhost:8080/muutaKysymys/id/${muutettu.kysymykset[i].id}/kys_nimi/${muutettu.kysymykset[i].kys_nimi}`)
      }
    }

    if (muutettu.vastaukset.length > 0) {
      for(let i = 0; i < muutettu.vastaukset.length; i++){
        await axios.put(`https://localhost:8080/muutaVastaus/id/${muutettu.vastaukset[i].id}/vas_nimi/${muutettu.vastaukset[i].vas_nimi}/kysymys_id/${muutettu.vastaukset[i].kysymys_id}/pisteet/${muutettu.vastaukset[i].pisteet}/onko_oikein/${muutettu.vastaukset[i].onko_oikein}`)
      }
    }

    if (poistettu.tentit.length > 0) {
      await axios.delete(`https://localhost:8080/`)
    }

    if (poistettu.kysymykset.length > 0) {
      for(let i = 0; i < poistettu.kysymykset.length; i++){
        await axios.delete(`https://localhost:8080/poistaKysymys/id/${poistettu.kysymykset[i].id}`)
      }
    }

    if (poistettu.vastaukset.length > 0) {
      for(let i = 0; i < poistettu.vastaukset.length; i++){
        await axios.delete(`https://localhost:8080/poistaVastaus/id/${poistettu.vastaukset[i].id}`)
      }
    }
  }

  return (
    <div className='Screen'>
      {data.tenttiNäkymä &&
        <div className='App-header'>
          {/* <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_TENTTINUMERO', payload:0})}>{data.tentti.ten_nimi} </button> */}
          {/* <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_TENTTINUMERO', payload:1})}>{tentti2.ten_nimi} </button> */}
          {/* <button className='Nappi' onClick = {() => dispatch({type:'MUUTA_MOODI', payload:!data.opettajaMoodi})}>{data.opettajaMoodi ? "Oppilasmoodiin" : "Opettajamoodiin"} </button> */}
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
          <div> {<KirjauduRuutu kirjaudu={data.kirjauduRuutu} dispatch={dispatch} />} </div>

        </div>}
    </div>
  );
}

export default App;

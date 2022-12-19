import './App.css';
import Tentti from './Tentti';
import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios'
import KirjauduRuutu from './Kirjaudu';
import DBG from './DBG.png';
import BG from './BG.png';
import reducer from './Reducer.js';
import lahjoja from './lahjoja.png';
import eiLahjoja from './Joulukakka.png';

const App = () => {

  const [data, dispatch] = useReducer(reducer.reducer, {
    tentit: {}, tentti: {}, tallennetaanko: false, opettajaMoodi: false, tenttiNäkymä: false, kirjauduRuutu: true, darkMode: false,
    muutettuData: { tentit: [], kysymykset: [], vastaukset: [] },
    lisättyData: { tentit: [], kysymykset: [], vastaukset: [] },
    poistettuData: { tentit: [], kysymykset: [], vastaukset: [] },
    käyttäjänVastaukset: [], näytäSuoritus: false , tenttiSuoritus: {läpi: false, pisteet: 0}
  });

  const [ajastin, setAjastin] = useState()

  function ajoitettuVaroitus() {
    clearTimeout(ajastin)
    !data.kirjauduRuutu && data.opettajaMoodi && setAjastin(setTimeout(function () { alert("Hälytys, tallenna välillä."); }, 6000));
    //TODO:laita tallentamaan tässä suoraan?
  }

  function lopetaAjastin() {
    console.log("Lopetetaan ajastin")
    clearTimeout(ajastin)
  }

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken")
    const käyt = JSON.parse(localStorage.getItem("käyttäjä"))
    if (refreshToken) {
      dispatch({ type: 'VAIHDA_TENTTINÄKYMÄ', payload: { tenttiNäkymä: true, onko_admin: käyt.onko_admin } })
      getData(käyt.tentti, refreshToken)
    }
  }, [])

  useEffect(() => {

    if (data.muutettuData.tentit.length > 0 || data.muutettuData.kysymykset > 0 || data.muutettuData.vastaukset > 0 ||
      data.poistettuData.kysymykset > 0 || data.poistettuData.vastaukset > 0) {
      console.log("tenteissä muutoksia")
      ajoitettuVaroitus()
    }
  }, [data.muutettuData, data.poistettuData])

  useEffect(() => {
    const saveData = () => {

      if (data.opettajaMoodi) {
        try {
          console.log("Muutokset tallennetaan")
          välitäMuutokset(data.lisättyData, data.muutettuData, data.poistettuData)
          dispatch({ type: 'TYHJENNÄ_MUUTOKSET' })
        } catch (err) {
          console.log("Virhe tallennettaessa", err)
        }
      } else {
        try{
          console.log("Tenttisuoritus tallennetaan")
          tallennaTenttisuoritus()
        }catch (err){
          console.log("Virhe tallennettaessa", err)
        }
      }

      dispatch({ type: 'PÄIVITÄ_TALLENNUSTILA', payload: false })
    }
    if (data.tallennetaanko === true) {
      saveData()
    }
  }, [data.tallennetaanko]);

  const välitäMuutokset = async (lisätty, muutettu, poistettu) => {
    console.log("lis", lisätty, "muu", muutettu, "pois", poistettu)
    if (lisätty.tentit.length > 0) {
      for (let i = 0; i < lisätty.tentit.length; i++) {
        await axios.post(`https://localhost:8080/lisaaTentti/nimi/${lisätty.tentit[i].ten_nimi}`)
        await getData(0) //koska tentti vasta lisättiin haetaan uusin tentti argumentilla 0
      }
    }

    if (lisätty.kysymykset.length > 0) {
      for (let i = 0; i < lisätty.kysymykset.length; i++) {
        await axios.post(`https://localhost:8080/lisaaKysymys/kysymys/${lisätty.kysymykset[i].kys_nimi}/tentti/${lisätty.kysymykset[i].tentti_id}`)
      }
      await getData(data.tentti.id)
    }

    if (lisätty.vastaukset.length > 0) {
      for (let i = 0; i < lisätty.vastaukset.length; i++) {
        await axios.post(`https://localhost:8080/lisaaVastaus/vastaus/${lisätty.vastaukset[i].vas_nimi}/kysymys_id/${lisätty.vastaukset[i].kysymys_id}/pisteet/${lisätty.vastaukset[i].pisteet}/onko_oikein/${lisätty.vastaukset[i].onko_oikein}`)
      }
      await getData(data.tentti.id)
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
        await getData(0) //koska tentti poistettiin, heataan uusin tentti argumentilla 0
      }
    }
  }

  const tallennaTenttisuoritus = async () => {
    const suoritus = {
      tentti_id: data.tentti.id,
      vastaukset: data.käyttäjänVastaukset,
      pisteet: 0,
      min_pisteet: data.tentti.minPisteet
    }
    try{
      const result = await axios.post(`https://localhost:8080/tallennaSuoritus`, {data: JSON.stringify(suoritus)})
      dispatch({type: 'NÄYTÄ_SUORITUS', payload: {pisteet: result.data.pisteet, läpi: result.data.läpi}})
    }catch(err){
      console.log(err)
    }
  }

  const getData = async (tentti_id, rT) => {
    if(rT !== undefined){
      try {
        const resTentti = await axios.post(`https://localhost:8080/tentti/id/${tentti_id}`, {refreshToken: rT});
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + resTentti.data.token;
        const resTentit = await axios.get(`https://localhost:8080/tentit/`);
        console.log("Alustus result:", resTentti.data.tentti, resTentit.data)
        dispatch({ type: 'ALUSTA_DATA', payload: { tentti: resTentti.data.tentti, tentit: resTentit.data } })
      } catch (error) {
        console.log("Virhe alustaessa: ", error)
      }
    }else{
      try {
        const resTentti = await axios.post(`https://localhost:8080/tentti/id/${tentti_id}`);
        const resTentit = await axios.get(`https://localhost:8080/tentit/`);
        console.log("Alustus result:", resTentti.data, resTentit.data)
        dispatch({ type: 'ALUSTA_DATA', payload: { tentti: resTentti.data.tentti, tentit: resTentit.data } })
      } catch (error) {
        console.log("Virhe alustaessa: ", error)
      }
    }
  }

  const kirjauduSisään = async (käyttäjä) => {
    try {
      const result = await axios.post(`https://localhost:8080/kirjaudu/tunnus/${käyttäjä.tunnus}/salasana/${käyttäjä.salasana}`);
      if (result) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.data.token;
        localStorage.setItem("refreshToken", result.data.data.refreshToken);
        const käyt = {id: result.data.data.id, onko_admin: result.data.data.onko_admin, tentti: result.data.data.tentti_id }
        localStorage.setItem("käyttäjä", JSON.stringify(käyt));
        dispatch({ type: 'VAIHDA_TENTTINÄKYMÄ', payload: { tenttiNäkymä: true, onko_admin: result.data.data.onko_admin } })
        console.log("kirjaudu result:", result.data)
        getData(result.data.data.tentti_id)
      }
    } catch (err) {
      console.log("Virhe kirjautuessa", err)
    }
  }

  const kirjauduUlos = async () => {
    localStorage.clear();
    window.location.reload();
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

    if (!data.darkMode) {
      document.querySelector(':root').style.setProperty('--bg', `url(${DBG})`)
      document.querySelector(':root').style.setProperty('--fontColor', 'white')
      dispatch({ type: 'DARK_MODE', payload: true })
    } else {
      document.querySelector(':root').style.setProperty('--bg', `url(${BG})`)
      document.querySelector(':root').style.setProperty('--fontColor', `black`)
      dispatch({ type: 'DARK_MODE', payload: false })
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
                <a className="Nappi" onClick={() =>
                  getData(tent.id)}
                  key={tent.id}>{tent.ten_nimi}</a>)}
            </div>
          </div>}
          <button className="Nappi" onClick={() => dispatch({ type: 'LISÄÄ_TENTTI', payload: {} })}>Lisää tentti</button>
          <button className="Nappi" onClick={() => {
            if (window.confirm("Haluatko varmasti poistaa koko tentin? Poiston jälkeen sitä ei voi palauttaa.")) {
              dispatch({ type: 'POISTA_TENTTI', payload: data.tentti })
            }
          }}>Poista tentti</button>
          <button className="Nappi" onClick={() => vaihdaTeema()}>{data.darkMode ? 'Light Mode' : 'Dark Mode'}</button>
          <button className="Nappi" onClick={() => kirjauduUlos()}>Kirjaudu Ulos</button>
        </div>}
      {!data.tenttiNäkymä &&
        <div className='App-header'>
          <button className='Nappi' onClick={() => dispatch({ type: 'KIRJAUDU_RUUTU', payload: true })}>Kirjaudu</button>
          <button className='Nappi' onClick={() => dispatch({ type: 'KIRJAUDU_RUUTU', payload: false })}>Rekisteröidy</button>
          <button className='Nappi' onClick={() => { }}>Tietoa sovelluksesta</button>
          <button className="Nappi" onClick={() => vaihdaTeema()}>{data.darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        </div>}

      {data.tenttiNäkymä && !data.näytäSuoritus &&
        <div className='Main-content'>
          <div> {data.tietoAlustettu && <Tentti tentti={data.tentti} moodi={data.opettajaMoodi} dispatch={dispatch} />} </div>
          {<button className='Nappi' onClick={() => { dispatch({ type: 'PÄIVITÄ_TALLENNUSTILA', payload: true }); lopetaAjastin() }}>Tallenna tiedot</button>}
        </div>}
        {data.tenttiNäkymä && data.näytäSuoritus &&
        <div className='Main-content'>
          <div> {data.tentti.ten_nimi} </div>
          <div> {data.tenttiSuoritus.pisteet} </div>
          <div> 
            {data.tenttiSuoritus.läpi && <> <div> Suoritus hyväksytty, lahjoja tulossa! </div> <img src={lahjoja} alt="lahjoja.png"/></>} 
            {!data.tenttiSuoritus.läpi && <> <div> Suoritus hylätty, ei tule lahjoja! </div> <img src={eiLahjoja} alt="eiLahjoja.png"/> </>} 
          </div>

          {<button className='Nappi' onClick={() => { dispatch({ type: 'PÄIVITÄ_TALLENNUSTILA', payload: true }); lopetaAjastin() }}>Tallenna tiedot</button>}
        </div>}
      {!data.tenttiNäkymä &&
        <div className='Main-content'>
          <div> {<KirjauduRuutu kirjaudu={data.kirjauduRuutu} kirjauduSisään={kirjauduSisään} rekisteröiUusi={rekisteröiUusi} />} </div>
        </div>}
    </div>
  );
}

export default App;

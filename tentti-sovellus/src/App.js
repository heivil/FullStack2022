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
    tentit: {}, tentti: {}, tallennetaanko: false, opettajaMoodi: true, tenttiNäkymä: true, kirjauduRuutu: false, darkMode: false,
    muutettuData: { tentit: [], kysymykset: [], vastaukset: [] },
    lisättyData: { tentit: [], kysymykset: [], vastaukset: [] },
    poistettuData: { tentit: [], kysymykset: [], vastaukset: [] },
    käyttäjänVastaukset: [], näytäSuoritus: false, tenttiSuoritus: { läpi: false, pisteet: 0 }, xmin: 0
  });

  const [ajastin, setAjastin] = useState()

  function ajoitettuVaroitus() {
    clearTimeout(ajastin)
    !data.kirjauduRuutu && data.opettajaMoodi && setAjastin(setTimeout(function () { alert("Hälytys, tallenna välillä."); }, 60000));
    //TODO:laita tallentamaan tässä suoraan?
  }

  function lopetaAjastin() {
    console.log("Lopetetaan ajastin")
    clearTimeout(ajastin)
  }

  useEffect(() => {
    /* const refreshToken = localStorage.getItem("refreshToken")
    const käyt = JSON.parse(localStorage.getItem("käyttäjä"))
    //let _socket = new WebSocket("wss://localhost:8080");
    if (refreshToken) {
      dispatch({ type: 'VAIHDA_TENTTINÄKYMÄ', payload: { tenttiNäkymä: true, onko_admin: true } })
      getData(käyt.tentti)
    } */
    getData(1)
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
        try {
          console.log("Tenttisuoritus tallennetaan")
          tallennaTenttisuoritus()
        } catch (err) {
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
        await axios.post(`http://localhost:5167/api/Tentti/`, {
          "id": 0,
          "ten_nimi": lisätty.tentit[i].ten_nimi,
          tentti_pvm: new Date().toISOString()
        })
        await getData(0) //koska tentti vasta lisättiin haetaan uusin tentti argumentilla 0
      }
    }

    if (lisätty.kysymykset.length > 0) {
      for (let i = 0; i < lisätty.kysymykset.length; i++) {
        await axios.post(`http://localhost:5167/api/Kysymys/`, lisätty.kysymykset[i])
      }
      await getData(data.tentti.id)
    }

    if (lisätty.vastaukset.length > 0) {
      for (let i = 0; i < lisätty.vastaukset.length; i++) {
        await axios.post(`http://localhost:5167/api/Vastaus/`, lisätty.vastaukset[i])
      }
      await getData(data.tentti.id)
    }

    if (muutettu.tentit.length > 0) {
      for (let i = 0; i < muutettu.tentit.length; i++) {
        try {
          await axios.put(`http://localhost:5167/api/Tentti/${muutettu.tentit[i].id}`, {
            id: muutettu.tentit[i].id,
            ten_nimi: muutettu.tentit[i].ten_nimi,
            tentti_pvm: new Date().toISOString()
          })
          /* if(result.status === 205){
            if (window.confirm("Joku muu on jo tehnyt muutoksia tähän tenttiin. Haluatko ladata sivun uudelleen päivitetyillä tiedoilla?")) {
              window.location.reload();
            }
          } */
        } catch (err) {
          console.log("errrrr", err)
        }
      }
    }

    if (muutettu.kysymykset.length > 0) {
      for (let i = 0; i < muutettu.kysymykset.length; i++) {
        await axios.put(`http://localhost:5167/api/Kysymys/${muutettu.kysymykset[i].id}`, muutettu.kysymykset[i])
      }
    }

    if (muutettu.vastaukset.length > 0) {
      for (let i = 0; i < muutettu.vastaukset.length; i++) {
        await axios.put(`http://localhost:5167/api/Vastaus/${muutettu.vastaukset[i].id}`, muutettu.vastaukset[i])
      }
    }

    if (poistettu.kysymykset.length > 0) {
      for (let i = 0; i < poistettu.kysymykset.length; i++) {
        await axios.delete(`http://localhost:5167/api/Kysymys/${poistettu.kysymykset[i].id}`)
      }
    }

    if (poistettu.vastaukset.length > 0) {
      for (let i = 0; i < poistettu.vastaukset.length; i++) {
        await axios.delete(`http://localhost:5167/api/Vastaus/${poistettu.vastaukset[i].id}`)
      }
    }

    if (poistettu.tentit.length > 0) {
      for (let i = 0; i < poistettu.tentit.length; i++) {
        await axios.delete(`http://localhost:5167/api/Tentti/${poistettu.tentit[i].id}`)
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
    try {
      const result = await axios.post(`https://localhost:8080/tallennaSuoritus`, { data: JSON.stringify(suoritus) })
      dispatch({ type: 'NÄYTÄ_SUORITUS', payload: { pisteet: result.data.pisteet, läpi: result.data.läpi } })
    } catch (err) {
      console.log(err)
    }
  }

  const getData = async (tentti_id/* , rT */) => {

    let tentti
    let kyssärit
    try {
      const resTentit = await axios.get(`http://localhost:5167/api/Tentti/`);
      if (tentti_id == 0) {
        tentti_id = resTentit.data[0].id
        console.log("uusi id: "+tentti_id)
      }

      const resTentti = await axios.get(`http://localhost:5167/api/Tentti/${tentti_id}`);
      //axios.defaults.headers.common['Authorization'] = 'Bearer ' + resTentti.data.token;
      const kysymykset = await axios.get(`http://localhost:5167/api/Kysymys/${tentti_id}`)
      const vastaukset = await axios.get(`http://localhost:5167/api/Vastaus/${tentti_id}`)
      console.log("vastauksia ", vastaukset.data.length)
      tentti = resTentti.data
      kyssärit = kysymykset.data
      let maxPisteet = 0

      //vastaus.id ja vastaus.kysymys_id tulee samana tietokannasta, eli ei toimi
      if (vastaukset.data.length > 0) {
        for (let i = 0; i < vastaukset.data.length; i++) {
          for (let j = 0; j < kyssärit.length; j++) {
            kyssärit[j].vastaukset === undefined && (kyssärit[j].vastaukset = [])
            if (kyssärit[j].id === vastaukset.data[i].kysymys_id) {
              if (data.onko_admin == true) {
                kyssärit[j].vastaukset.push(vastaukset.data[i])
              } else {
                kyssärit[j].vastaukset.push({
                  id: vastaukset.data[i].id,
                  kysymys_id: vastaukset.data[i].kysymys_id,
                  onko_oikein: vastaukset.data[i].onko_oikein,
                  vas_nimi: vastaukset.data[i].vas_nimi
                })
              }

              if (vastaukset.data[i].pisteet > 0) maxPisteet += vastaukset.data[i].pisteet
            }
          }
        }
      }
      tentti.kysymykset = kyssärit
      tentti.maxPisteet = maxPisteet
      tentti.minPisteet = maxPisteet / 2
    
      const tentit = {
        tenttejä: resTentit.data.length,
        tenttiLista: resTentit.data
      }
      
      console.log("Alustus result:", tentti)
      dispatch({ type: 'ALUSTA_DATA', payload: { tentti: tentti, tentit: tentit, xmin: resTentti.data.xmin } })
    } catch (error) {
      console.log("Virhe alustaessa: ", error)
    }

  }

  const kirjauduSisään = async (käyttäjä) => {
    try {
      const result = await axios.post(`https://localhost:8080/kirjaudu/tunnus/${käyttäjä.tunnus}/salasana/${käyttäjä.salasana}`);
      if (result) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.data.token;
        localStorage.setItem("refreshToken", result.data.data.refreshToken);
        const käyt = { id: result.data.data.id, onko_admin: result.data.data.onko_admin, tentti: result.data.data.tentti_id }
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
          <div> pisteet: {data.tenttiSuoritus.pisteet} </div>
          <div>
            {data.tenttiSuoritus.läpi && <> <div> Suoritus hyväksytty, lahjoja tulossa! </div> <img src={lahjoja} alt="lahjoja.png" /></>}
            {!data.tenttiSuoritus.läpi && <> <div> Suoritus hylätty, ei tule lahjoja! </div> <img src={eiLahjoja} alt="eiLahjoja.png" /> </>}
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

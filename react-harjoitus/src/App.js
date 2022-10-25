import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios'
import chuck from './chuck.jpg'

function ChuckNorrisFaktat() {

  const [appData, dispatch] = useReducer(reducer, { fakta: "",noudetaanFaktaa:false, 
  faktanNoutoEpäonnistui:false, faktaLista: [], aikaVäli: 5, failLaskuri: 0, näytetyt: [], toistuvuusLaskuri: 0});
  const [ajastin, setAjastin] = useState();

  //VANHA. Ei päivitä staten muuttujia funktion sisällä
  /* function ajoitettuFaktanHaku(aika){
    clearTimeout(ajastin)
    haeFakta()
    //console.log(appData.aikaVäli)
    setAjastin(setTimeout(function(){ ajoitettuFaktanHaku(appData.aikaVäli) }, aika * 1000));
  } */

  function ajoitettuFaktanHaku(aika){
    clearTimeout(ajastin)
    //console.log(appData.aikaVäli)
    setAjastin(setTimeout(function(){ haeFakta() }, aika * 1000));
  }

  function lopetaAjastin(){
    console.log("ajastin lopetetaan")
    clearTimeout(ajastin)
  }

  function reducer(state, action) {
    switch (action.type) {
      case 'FAKTAN_NOUTO_ALOITETTU':

        console.log("Faktan nouto aloitettu")
        return { ...state, noudetaanFaktaa:true}

      case 'FAKTA_NOUDETTU':

        console.log("Fakta noudettu")
        const appDataKopio = JSON.parse(JSON.stringify(state))
        if(!state.faktaLista.includes(action.payload) && action.payload !== ""){
          appDataKopio.faktaLista.push(action.payload)
        }
        appDataKopio.näytetyt.push(action.payload)
        return { ...state, fakta: action.payload, faktanNoutoEpäonnistui:false, 
          noudetaanFaktaa: false, faktaLista: appDataKopio.faktaLista, näytetyt:appDataKopio.näytetyt }

      case 'FAKTA_NÄYTETTY_JO':

        const näytöt = state.toistuvuusLaskuri +1
        console.log('Fakta on jo näytetty.', näytöt)
        return {...state, toistuvuusLaskuri: näytöt}

      case 'FAKTAN_NOUTO_EPÄONNISTUI':

        console.log("Faktan nouto epäonnistui")
        const failLaskuriKopio = state.failLaskuri + 1;
        return { ...state, faktanNoutoEpäonnistui: true, noudetaanFaktaa: false, failLaskuri: failLaskuriKopio}

      case 'AIKAVÄLI_MUUTETTU':

        return{...state, aikaVäli: action.payload}

      case 'DATA_ALUSTETTU':

        return{...state, faktaLista: action.payload}

      default:
        throw new Error("Reducer meni defaultiin.");
    }
  }

  useEffect(() => {
    //localStorage.clear();
    const ladattuData = localStorage.getItem('chuckNorrisData'); 
    if(ladattuData == null){
      const tallennus = JSON.parse(JSON.stringify(appData.faktaLista))
      localStorage.setItem('chuckNorrisData', JSON.stringify(tallennus));
    }else{
      dispatch({type: 'DATA_ALUSTETTU', payload: JSON.parse(ladattuData)})
    }
    clearTimeout(ajastin)
    ajoitettuFaktanHaku(appData.aikaVäli)
  }, []);

  useEffect(() => {
    localStorage.setItem('chuckNorrisData', JSON.stringify(appData.faktaLista));
  }, [appData.faktaLista])

  useEffect(()=>{
    ajoitettuFaktanHaku(appData.aikaVäli)
  }, [appData.fakta])

  async function haeFakta() {
      try{
        console.log("faktoja:", appData.faktaLista.length, "toistoja", appData.toistuvuusLaskuri)
        if(appData.toistuvuusLaskuri < 4){
          dispatch({type: 'FAKTAN_NOUTO_ALOITETTU'})
          let result;
          if(appData.failLaskuri < 0){
            result = await axios('https://api.chucknorris.io/jokes/random'); 
            if(!appData.faktanNoutoEpäonnistui){
              if(appData.näytetyt.includes(result)){
                dispatch({type:'FAKTA_NÄYTETTY_JO'})
                ajoitettuFaktanHaku(appData.aikaVäli)
              }else{
                dispatch({type: 'FAKTA_NOUDETTU', payload: result.data.value})
              }
            }
          }else if (appData.failLaskuri < 7){
            result = appData.faktaLista[Math.floor(Math.random() * appData.faktaLista.length)]
            if(!appData.faktanNoutoEpäonnistui){
              if(appData.näytetyt.includes(result)){
                dispatch({type:'FAKTA_NÄYTETTY_JO'})
                ajoitettuFaktanHaku(appData.aikaVäli)
              }else{
                dispatch({type: 'FAKTA_NOUDETTU', payload: result})
              }
            }
          }      
        }
      } catch (error){
        console.log("Erroria pukkaa: ", error)
        dispatch({type: 'FAKTAN_NOUTO_EPÄONNISTUI'})
      }
  }

  return (
    <div className='Main-content'>
      <img className='Chuck' src={chuck} alt='Chuck' onClick={()=>{ appData.toistuvuusLaskuri<4 && ajoitettuFaktanHaku(appData.aikaVäli)}}/>
      <div>{appData.fakta}</div>

      {/* <button className='Nappi' onClick={()=>{ appData.toistuvuusLaskuri<4 && ajoitettuFaktanHaku(appData.aikaVäli)}}>Hae vitsi</button> */}

      <button className='Nappi' onClick={()=>{lopetaAjastin()}}> Lopeta generointi</button>

      <p> Päivitä <input type="number" value = {appData.aikaVäli} onChange={(event)=>{dispatch({type: 'AIKAVÄLI_MUUTETTU', payload: event.target.value})}}/> sekunnin välein</p>

      <p>{appData.noudetaanFaktaa && "Noudetaan faktaa Chuck Norriksesta!"}</p>

      <p>{appData.faktanNoutoEpäonnistui && "Faktan nouto epäonnistui"}</p>

      <p>{appData.toistuvuusLaskuri >=4 && "Nyt on vitsit vähissä"}</p>
    </div>
  );
}

export default ChuckNorrisFaktat;
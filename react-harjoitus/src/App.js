import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios'

function ChuckNorrisFaktat() {

  const [appData, dispatch] = useReducer(reducer, { fakta: "",noudetaanFaktaa:false, faktanNoutoEpäonnistui:false, faktaLista: [], aikaVäli: 5, failLaskuri: 0});
  const [ajastin, setAjastin] = useState();

  //ei päivitä appdata.aikaväliä 
  function ajoitettuFaktanHaku(aika){
    clearTimeout(ajastin)
    haeFakta()
    //console.log(appData.aikaVäli)
    setAjastin(setTimeout(function(){ ajoitettuFaktanHaku(appData.aikaVäli) }, aika * 1000));
  }

  function lopetaAjastin(){
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
        return { ...state, fakta: action.payload, faktanNoutoEpäonnistui:false, noudetaanFaktaa:false, faktaLista: appDataKopio.faktaLista }
      case 'FAKTAN_NOUTO_EPÄONNISTUI':
        console.log("Faktan nouto epäonnistui")
        const failLaskuriKopio = state.failLaskuri + 1;
        return { ...state, faktanNoutoEpäonnistui:true, noudetaanFaktaa:false, failLaskuri: failLaskuriKopio}
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
    setAjastin(setTimeout(function(){ ajoitettuFaktanHaku(appData.aikaVäli) }, appData.aikaVäli * 1000));
  }, []);

  useEffect(() => {
    localStorage.setItem('chuckNorrisData', JSON.stringify(appData.faktaLista));
  }, [appData.faktaLista])

  async function haeFakta() {
    try{
      dispatch({type: 'FAKTAN_NOUTO_ALOITETTU'})
      let result;
      if(appData.failLaskuri < 4){
        result = await axios('https://api.chucknorris.io/jokes/random'); 
        if(!appData.faktanNoutoEpäonnistui)dispatch({type: 'FAKTA_NOUDETTU', payload: result.data.value})
      }else if (appData.failLaskuri < 7){
        result = appData.faktaLista[Math.floor(Math.random() * appData.faktaLista.length)]
        console.log(appData.faktaLista.length)
        if(!appData.faktanNoutoEpäonnistui)dispatch({type: 'FAKTA_NOUDETTU', payload: result})
      }
      
      
    } catch (error){
      console.log("Erroria pukkaa: ", error)
      dispatch({type: 'FAKTAN_NOUTO_EPÄONNISTUI'})
    }
  }

  return (
    <div>
      <div>{appData.fakta}</div>
      <input type="number" value = {appData.aikaVäli} onChange={(event)=>{dispatch({type: 'AIKAVÄLI_MUUTETTU', payload: event.target.value})}}/>

      <button onClick={()=>{ ajoitettuFaktanHaku(appData.aikaVäli)}}>Hae vitsi</button>

      <button onClick={()=>{lopetaAjastin()}}> Lopeta generointi</button>

      <p>{appData.noudetaanFaktaa && "Noudetaan faktaa Chuck Norriksesta!"}</p>

      <p>{appData.faktanNoutoEpäonnistui && "Faktan nouto epäonnistui"}</p>
    </div>
  );
}

export default ChuckNorrisFaktat;
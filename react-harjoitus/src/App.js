import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios'

function ChuckNorrisFaktat() {

  const [appData, dispatch] = useReducer(reducer, { fakta: "",noudetaanFaktaa:false, faktanNoutoEpäonnistui:false, faktaLista: [], aikaVäli: 5});
  const [ajastin, setAjastin] = useState()

  function ajoitettuFaktanHaku(aika){
    clearTimeout(ajastin)
    haeFakta()
    console.log(appData.aikaVäli)
    setAjastin(setTimeout(function(){ ajoitettuFaktanHaku(appData.aikaVäli) }, aika * 1000));
  }


  function reducer(state, action) {
    switch (action.type) {
      case 'FAKTAN_NOUTO_ALOITETTU':
        console.log("Faktan nouto aloitettu")
        return { ...state, noudetaanFaktaa:true}
      case 'FAKTA_NOUDETTU':
        console.log("Fakta noudettu")
        //tallenna täällä
        return { ...state, fakta: action.payload, noudetaanFaktaa:false  }
      case 'FAKTAN_NOUTO_EPÄONNISTUI':
        console.log("Faktan nouto epäonnistui")
        return { ...state, faktanNoutoEpäonnistui:true, noudetaanFaktaa:false }
      case 'AIKAVÄLI_MUUTETTU':
        return{aikaVäli: action.payload}
      case 'DATA_ALUSTETTU':
        return{...state, faktaLista: action.payload}
      default:
        throw new Error("Reducer meni defaultiin.");
    }
  }



  useEffect(() => {
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

  async function haeFakta() {
    try{
      dispatch({type: 'FAKTAN_NOUTO_ALOITETTU'})
      let result = await axios('https://api.chucknorris.io/jokes/random'); 
      dispatch({type: 'FAKTA_NOUDETTU', payload: result.data.value})
    } catch (error){
      console.log("Erroria pukkaa: ", error)
      dispatch({type: 'FAKTAN_NOUTO_EPÄONNISTUI'})
    }
  }

  return (
    <div>
      {/* aikaa jäljellä uuteen faktaan tähän */}
      <div>{appData.fakta}</div>
      <input type="number" value = {appData.aikaVäli} onChange={(event)=>{dispatch({type: 'AIKAVÄLI_MUUTETTU', payload: event.target.value})}}/>

      {appData.noudetaanFaktaa && "Noudetaan faktaa Chuck Norriksesta!"}

      {appData.faktanNoutoEpäonnistui && "Faktan nouto epäonnistui"}

      <button onClick={()=>{
        ajoitettuFaktanHaku(appData.aikaVäli)
      }}
      >
        Hae vitsi
      </button>

    </div>
  );
}

export default ChuckNorrisFaktat;
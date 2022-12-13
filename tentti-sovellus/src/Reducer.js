function reducer(state, action) {
  const dataKopio = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case 'VASTAUS_MUUTTUI':
      
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].vas_nimi = action.payload.vas_nimi
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].onko_oikein = action.payload.onko_oikein
        if(action.payload.onko_oikein){
          dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].pisteet = 1
        }else{
          dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex].pisteet = -0.5
        }
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
      console.log("tentti lisätty")
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

      return { ...state, tenttiNäkymä: action.payload.tenttiNäkymä, opettajaMoodi: action.payload.onko_admin }

    case 'DARK_MODE':

        return{...state, darkMode: action.payload}

    case 'LISÄÄ_KÄYTTÄJÄN_VASTAUS':
      console.log("Suoritukseen lisätään vastaus:", action.payload)
      dataKopio.käyttäjänVastaukset.push(action.payload)
      return{...state, käyttäjänVastaukset: dataKopio.käyttäjänVastaukset}

    case 'POISTA_KÄYTTÄJÄN_VASTAUS':
      console.log("Suorituksesta poistetaan vastaus: ", action.payload)
      dataKopio.käyttäjänVastaukset = dataKopio.käyttäjänVastaukset.filter(id => id !== action.payload)
      return{...state, käyttäjänVastaukset: dataKopio.käyttäjänVastaukset}

    default:
      throw new Error("Reduceriin tultiin oudosti.");
  }
}

module.exports ={ 
  reducer
}
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
        dataKopio.muutettuData.tentit.some(ten => ten.id === action.payload.id && (ten.ten_nimi = action.payload.ten_nimi))
      }
      return { ...state, tentti: dataKopio.tentti, muutettuData: dataKopio.muutettuData };

    case 'POISTA_KYSYMYS':

      const kysymyksetKopio = dataKopio.tentti.kysymykset.filter(kysymys =>
      kysymys !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex])
      dataKopio.tentti.kysymykset = kysymyksetKopio
      dataKopio.poistettuData.kysymykset.push(action.payload.kysymys)
      //poistetaan poistettu kysymys muutetut ja lis??tyt listalta
      dataKopio.lis??ttyData.kysymykset = dataKopio.lis??ttyData.kysymykset.filter(kys => kys.id !== action.payload.kysymys.id)
      dataKopio.muutettuData.kysymykset = dataKopio.muutettuData.kysymykset.filter(kys => kys.id !== action.payload.kysymys.id)
      return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData, lis??ttyData: dataKopio.lis??ttyData };

    case 'POISTA_VASTAUS':

      const vastauksetKopio = dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.filter(vastaus =>
      vastaus !== dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset[action.payload.vastausIndex])
      dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = vastauksetKopio
      dataKopio.poistettuData.vastaukset.push(action.payload.vastaus)
      //poistetaan poistettu kysymys muutetut ja lis??tyt listalta
      dataKopio.lis??ttyData.vastaukset = dataKopio.lis??ttyData.vastaukset.filter(vas => vas.id !== action.payload.vastaus.id)
      dataKopio.muutettuData.vastaukset = dataKopio.muutettuData.vastaukset.filter(vas => vas.id !== action.payload.vastaus.id)
      return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData, lis??ttyData: dataKopio.lis??ttyData };

    case 'POISTA_TENTTI':

      const tentitKopio = dataKopio.tentit.tenttiLista.filter(tentti => tentti !== dataKopio.tentit[action.payload.tenttiIndex])
      dataKopio.tentit.tenttiLista = tentitKopio
      dataKopio.poistettuData.tentit.push(action.payload)
      //vaihda staten tentti johonkin toiseen
      return { ...state, tentti: dataKopio.tentti, poistettuData: dataKopio.poistettuData, tentit: dataKopio.tentit, tallennetaanko: true};

    case 'LIS????_TENTTI':
      
      const uusiTentti = { ten_nimi: "Uusi tentti"}
      dataKopio.lis??ttyData.tentit.push(uusiTentti)
      dataKopio.tentti = uusiTentti //staten tentiksi pit???? asettaa tietokannasta saatu tentti
      console.log("tentti lis??tty: ")
      return { ...state, tentti: dataKopio.tentti, lis??ttyData: dataKopio.lis??ttyData, tallennetaanko: true };

    case 'LIS????_KYSYMYS':

      const uusiKysymys = { kys_nimi: "Uusi kysymys", tentti_id: action.payload.tentti_id, vastaukset:[] }
      dataKopio.lis??ttyData.kysymykset.push(uusiKysymys)
      dataKopio.tentti.kysymykset.push(uusiKysymys)
      console.log("kysymys lis??tty", dataKopio.tentti)
      return { ...state, tentti: dataKopio.tentti, lis??ttyData: dataKopio.lis??ttyData, tallennetaanko: true };

    case 'LIS????_VASTAUS':
      
      console.log("lis??t????n vastausta", action.payload)
      //korjaa pisteet ja onko oikein uusiVastauksessa !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const uusiVastaus = { vas_nimi: "Uusi vastaus", kysymys_id: action.payload.kysymys_id, pisteet: 0, onko_oikein: false };
      if(dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset === undefined){
        dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset = []
      }
      dataKopio.tentti.kysymykset[action.payload.kysymysIndex].vastaukset.push(uusiVastaus)
      dataKopio.lis??ttyData.vastaukset.push(uusiVastaus)
      return { ...state, lis??ttyData: dataKopio.lis??ttyData, tentti: dataKopio.tentti, tallennetaanko: true };

    case 'VAIHDA_TENTTI':

      console.log("tentti vaihtuu", action.payload.id)
      return { ...state, tenttiNumero: action.payload.id}

    case 'P??IVIT??_TALLENNUSTILA':

      return { ...state, tallennetaanko: action.payload };

    case 'TYHJENN??_MUUTOKSET':

      const tyhj??MuutosObj = { tentit: [], kysymykset: [], vastaukset: [] }
      return { ...state, muutettuData: tyhj??MuutosObj, poistettuData: tyhj??MuutosObj, lis??ttyData: tyhj??MuutosObj }

    case 'ALUSTA_DATA':

      return {...state, tentti: action.payload.tentti, tentit: action.payload.tentit, tietoAlustettu: true, xmin: action.payload.xmin};

    case 'KIRJAUDU_RUUTU':

      return { ...state, kirjauduRuutu: action.payload }

    case 'VAIHDA_TENTTIN??KYM??':

      return { ...state, tenttiN??kym??: action.payload.tenttiN??kym??, opettajaMoodi: action.payload.onko_admin }

    case 'DARK_MODE':

        return{...state, darkMode: action.payload}

    case 'LIS????_K??YTT??J??N_VASTAUS':
      console.log("Suoritukseen lis??t????n vastaus:", action.payload)
      dataKopio.k??ytt??j??nVastaukset.push(action.payload)
      return{...state, k??ytt??j??nVastaukset: dataKopio.k??ytt??j??nVastaukset}

    case 'POISTA_K??YTT??J??N_VASTAUS':
      console.log("Suorituksesta poistetaan vastaus: ", action.payload)
      dataKopio.k??ytt??j??nVastaukset = dataKopio.k??ytt??j??nVastaukset.filter(id => id !== action.payload)
      return{...state, k??ytt??j??nVastaukset: dataKopio.k??ytt??j??nVastaukset}

    case 'N??YT??_SUORITUS':

    dataKopio.tenttiSuoritus = {l??pi: action.payload.l??pi, pisteet: action.payload.pisteet}
    console.log("esd",dataKopio.tenttiSuoritus)
    return{...state, n??yt??Suoritus: true, tenttiSuoritus: dataKopio.tenttiSuoritus }

    default:
      throw new Error("Reduceriin tultiin oudosti.");
  }
}

module.exports ={ 
  reducer
}
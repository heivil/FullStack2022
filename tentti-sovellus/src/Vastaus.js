import trash from './trash.png';

const Vastaus = (props) => {
  return (
    <div className="Vastaus">
      {props.moodi ? <>
        <label>Oikea vastaus<input type="checkbox" id={`Vastaus${props.vastaus.id}`} checked={props.vastaus.onko_oikein} onChange={(event) => {
          props.dispatch({
            type: 'VASTAUS_MUUTTUI',
            payload: {
              id: props.vastaus.id,
              vas_nimi: props.vastaus.vas_nimi,
              vastausIndex: props.vastausIndex,
              kysymysIndex: props.kysymysIndex,
              onko_oikein: event.target.checked
            }
          })
        }} /></label>
        <input type="text" onChange={(event) => {
          props.dispatch({
            type: 'VASTAUS_MUUTTUI',
            payload: {
              id: props.vastaus.id,
              vas_nimi: event.target.value,
              vastausIndex: props.vastausIndex,
              kysymysIndex: props.kysymysIndex,
              onko_oikein: document.getElementById(`Vastaus${props.vastaus.id}`).checked
            }
          })
        }} value={props.vastaus.vas_nimi} />
        <img className='Image-nappi' src={trash} alt="Poista vastausvaihtoehto" onClick={() => {
          props.dispatch({ type: 'POISTA_VASTAUS', payload: { kysymysIndex: props.kysymysIndex, vastausIndex: props.vastausIndex, vastaus: props.vastaus } })
        }} />
      </>
        : <div><input type="checkbox" onChange={(event) => {
          if(event.target.checked){
            props.dispatch({
              type: 'LISÄÄ_KÄYTTÄJÄN_VASTAUS',
              payload: props.vastaus.id
            })
          }else{
            props.dispatch({
              type: 'POISTA_KÄYTTÄJÄN_VASTAUS',
              payload: props.vastaus.id
            })
          }
        }}/> {props.vastaus.vas_nimi} </div>}
    </div>
  );
}

export default Vastaus;
import trash from './trash.png';

const Vastaus = (props) => {
  return (
    <div className="Vastaus">
      {props.moodi && 
      <label>Oikea vastaus<input type="checkbox" id={`Oikein${props.vastaus.id}`} checked={props.vastaus.onko_oikein} onChange= {(event) => {
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
      }} /></label>}
      {props.moodi ?
        <>
          <input type="text" onChange={(event) => {
            props.dispatch({
              type: 'VASTAUS_MUUTTUI',
              payload: {
                id: props.vastaus.id,
                vas_nimi: event.target.value,
                vastausIndex: props.vastausIndex,
                kysymysIndex: props.kysymysIndex,
                onko_oikein: document.getElementById(`Oikein${props.vastaus.id}`).checked
              }
            })
          }} value={props.vastaus.vas_nimi} />
          <img className='Image-nappi' src={trash} alt="Poista vastausvaihtoehto" onClick={() => {
            props.dispatch({ type: 'POISTA_VASTAUS', payload: { kysymysIndex: props.kysymysIndex, vastausIndex: props.vastausIndex, vastaus: props.vastaus } })
          }} />
        </>
        : <div> {props.vastaus.vas_nimi} </div>}
    </div>
  );
}

export default Vastaus;
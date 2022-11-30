import trash from './trash.png';

const Vastaus = (props) => {
  return (
    <div className="Vastaus">
      <input type="checkbox" />
      {props.moodi ?
        <>
          <div> {props.vastaus.vas_nimi} <input type="text" onChange={(event) => {
            props.vastaus.id !== undefined ?
            props.dispatch({
              type: 'VASTAUS_MUUTTUI',
              payload: {
                id: props.vastaus.id,
                vas_nimi: event.target.value,
                vastausIndex: props.vastausIndex,
                kysymysIndex: props.kysymysIndex,
              }
            }) :
            props.dispatch({
              type: 'LISÄÄ_VASTAUS',
              payload: {
                vas_nimi: event.target.value,
                vastausIndex: props.vastausIndex,
                kysymysIndex: props.kysymysIndex,
                vanhaVastaus: props.vastaus.vas_nimi
              }
            })
          }} value={props.vastaus.vas_nimi} />
          </div>
          <img className='Image-nappi' src={trash} alt="Poista vastausvaihtoehto" onClick={() => {
            props.dispatch({ type: 'POISTA_VASTAUS', payload: { kysymysIndex: props.kysymysIndex, vastausIndex: props.vastausIndex, vastaus: props.vastaus } })
          }} />
        </>
        : <div> {props.vastaus.vas_nimi} </div>}
    </div>
  );
}

export default Vastaus;
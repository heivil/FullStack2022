import trash from './trash.png';

const Vastaus = (props) => {
  return (
    <div className="Vastaus">
      <input type="checkbox"/>
      {props.moodi ? 
      <>
      <div> {props.vastaus.vas_nimi} <input type = "text" onChange={(event) => 
        {props.dispatch({type: 'VASTAUS_MUUTTUI', 
        payload: {
          vastaus: event.target.value,
          vastausIndex: props.vastausIndex,
          kysymysIndex: props.kysymysIndex
        }})}} value = {props.vastaus.vas_nimi}/>
      </div>
      <img className='Image-nappi' src={trash} alt="Poista vastausvaihtoehto" onClick={() => { 
        props.dispatch({type: 'POISTA_VASTAUS', payload: {kysymysIndex: props.kysymysIndex, vastausIndex: props.vastausIndex}})}}/>
      </>
      : <div> {props.vastaus.vas_nimi} </div>}
    </div>
  );
}

export default Vastaus;
const Vastaus = (props) => {
  return (
    <div className="Vastaus">
      <input type="checkbox"></input>
      <div> {props.vastaus} <input type = "text" onChange={(event) => 
        {props.dispatch({type: 'VASTAUS_MUUTTUI', 
        payload: {
          vastaus: event.target.value,
          vastausIndex : props.vastausIndex,
          kysymysIndex: props.kysymysIndex
        }})}} value = {props.vastaus}/></div>
    </div>
  );
}

export default Vastaus;
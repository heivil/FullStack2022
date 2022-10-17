import Vastaus from "./Vastaus";

const Kysymys = (props) => {
  return (
    <div className="Kysymys">
      <input type="text" onChange={(event)=>{props.dispatch({type: 'KYSYMYS_MUUTTUI', 
      payload:
      {
        kysymys: event.target.value, 
        kysymysIndex: props.kysymysIndex,
        tentti: props.tentti
      }})}} value = {props.kysymys.kysymys}/>
      <div> {props.kysymys.kysymys} </div>
            {props.kysymys.vastaukset.map((vastaus, index) => <div key={index}> <Vastaus vastaus = {vastaus}/> </div>)}
    </div>
  );
}

export default Kysymys;
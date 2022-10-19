import Vastaus from "./Vastaus";
import trash from './trash.png'
import plus from './plus.png'

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
            {props.kysymys.vastaukset.map((vastaus, index) => 
            <div key={index}> 
            <Vastaus vastaus = {vastaus} dispatch = {props.dispatch} kysymysIndex = {props.kysymysIndex} vastausIndex = {index}/> 
            </div>)}
            <img className="Nappi" src={plus} alt="Lisää vastausvaihtoehto" onClick={(event)=>
            {props.dispatch({type: 'LISÄÄ_VASTAUS', payload: {kysymysIndex: props.kysymysIndex}})}}/>
            <img className="Isompi-nappi" src={trash} alt="Poista kysymys" onClick={(event)=>
            {props.dispatch({type: 'POISTA_KYSYMYS', payload: {kysymysIndex: props.kysymysIndex}})}}/>
    </div>
  );
}

export default Kysymys;
import Kysymys from './Kysymys'
import plus from './plus.png' 

const Tentti = (props) => {

  return (
    <div>
      <div>Tentti:  
        {props.moodi ? <input type="text" onChange={(event)=>{props.dispatch({type: 'TENTTI_MUUTTUI', 
          payload:
          {
            id: props.tentti.id,
            ten_nimi: event.target.value
          }})}} value = {props.tentti.ten_nimi}/> : <> {props.tentti.ten_nimi}</>}
        <p>Läpäisyyn vaadittavat pisteet: {props.tentti.minPisteet}</p>
        <p>Maksimipisteet: {props.tentti.maxPisteet}</p>
      </div>
      <div>Kysymykset: </div>
      <div>{props.tentti.kysymykset !== undefined && props.tentti.kysymykset.length > 0 && props.tentti.kysymykset.map((kysymys, index) =>
        <Kysymys key = {index} kysymys={kysymys} dispatch = {props.dispatch} kysymysIndex = {index} tentti = {props.tentti} moodi={props.moodi}/>)} 
        {props.moodi && 
        <>
        <img className='Image-nappi' src={plus} alt="Lisää kysymys" onClick={(event) => {props.dispatch({type: 'LISÄÄ_KYSYMYS', payload: {tentti_id: props.tentti.id}})}} />
        </>}
      </div>
    </div>
  );
}

export default Tentti;

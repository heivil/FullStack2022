import Kysymys from './Kysymys'
import plus from './plus.png'

const Tentti = (props) => {
  return (
    <div>
      <div>Tentti: {props.tentti.ten_nimi} </div><br/>
      <div>Kysymykset: </div>
      <div>{props.tentti.kysymykset.map((kysymys, index) =>
        <Kysymys key = {index} kysymys={kysymys} dispatch = {props.dispatch} kysymysIndex = {index} tentti = {props.tentti} moodi={props.moodi}/>)} 
        {props.moodi && 
        <>
        <img className='Image-nappi' src={plus} alt="Lisää kysymys" onClick={(event) => {props.dispatch({type: 'LISÄÄ_KYSYMYS'})}} />
        </>}
      </div>
    </div>
  );
}

export default Tentti;

import Kysymys from './Kysymys'
import plus from './plus.png'

const Tentti = (props) => {
  return (
    <div>
      <div>Tentti: {props.tentti.nimi} </div>
      <div>Kysymykset: </div>
      <div>{props.tentti.kysymykset.map((kysymys, index) => 
        <Kysymys key = {index} kysymys={kysymys} dispatch = {props.dispatch} kysymysIndex = {index} tentti = {props.tentti}/>)} 
        <img className='Nappi' src={plus} alt="Lisää kysymys" onClick={(event) => {props.dispatch({type: 'LISÄÄ_KYSYMYS'})}} />
      </div>
    </div>
  );
}

export default Tentti;

import Kysymys from './Kysymys'
import trash from './trash.png'
import plus from './plus.png'

const Tentti = (props) => {
  return (
    <div>
      <div>Tentti: {props.tentti.nimi} </div>
      <div>Kysymykset: </div>
      <div>{props.tentti.kysymykset.map((kysymys, index) => 
        <Kysymys key = {index} kysymys={kysymys} dispatch = {props.dispatch} kysymysIndex = {index} tentti = {props.tentti}/>)} 
        <img className='Plus-nappi' src={plus} alt="Lisää kysymys"/>
      </div>
    </div>
  );
}

export default Tentti;

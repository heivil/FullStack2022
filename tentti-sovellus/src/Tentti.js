import Kysymys from './Kysymys'

const Tentti = (props) => {
  return (
    <div>
      <div>Tentti: {props.tentti.nimi} </div>
      <div>Kysymykset: </div>
      <div>{props.tentti.kysymykset.map((kysymys, index) => <Kysymys key = {index} kysymys={kysymys} kysymysMuuttuiHandler = {props.kysymysMuuttuiHandler} kysymysIndex = {index} tentti = {props.tentti}/>)} </div>
    </div>
  );
}

export default Tentti;

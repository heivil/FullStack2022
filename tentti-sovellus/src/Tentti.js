import Kysymys from './Kysymys'

const Tentti = (props) => {
  return (
    <div>
      <div>Tentti: {props.tentti.nimi} </div>
      <div>Kysymykset: </div>
      <div>{props.tentti.kysymykset.map(kysymys => <Kysymys kysymys={kysymys}/>)} </div>
    </div>
  );
}

export default Tentti;

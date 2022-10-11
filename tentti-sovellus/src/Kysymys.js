import Vastaus from "./Vastaus";

const Kysymys = (props) => {
  return (
    <div className="Kysymys">
      <div> {props.kysymys.kysymys} </div>
            {props.kysymys.vastaukset.map(vastaus => <div> <Vastaus vastaus = {vastaus}/> </div>)}
    </div>
  );
}

export default Kysymys;
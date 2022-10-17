import Vastaus from "./Vastaus";

const Kysymys = (props) => {
  return (
    <div className="Kysymys">
      <div> 
        {props.kysymys.kysymys} 
        <input type="text" onChange={(event)=>{ props.kysymysMuuttuiHandler(event.target.value, props.kysymysIndex, props.tentti)}} value = {props.kysymys.kysymys}/>
      </div>
            {props.kysymys.vastaukset.map((vastaus, index) => <div key={index}> <Vastaus vastaus = {vastaus}/> </div>)}
    </div>
  );
}

export default Kysymys;
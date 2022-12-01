import Vastaus from "./Vastaus";
import trash from './trash.png'
import plus from './plus.png'

const Kysymys = (props) => {
  return (
    <div className="Kysymys">
      {props.moodi ? <>
        <input type="text" onChange={(event) => {
          props.dispatch({
            type: 'KYSYMYS_MUUTTUI',
            payload: {
              id: props.kysymys.id,
              kys_nimi: event.target.value,
              kysymysIndex: props.kysymysIndex,
              tentti: props.tentti
            }
          })
        }
        } value={props.kysymys.kys_nimi} />
        <div> {props.kysymys.kys_nimi} </div>
        {props.kysymys.vastaukset !== undefined && props.kysymys.vastaukset.map((vastaus, index) =>
          <div key={index}>
            <Vastaus vastaus={vastaus} dispatch={props.dispatch} kysymysIndex={props.kysymysIndex} vastausIndex={index} moodi={props.moodi} />
          </div>)}
        <img className="Image-nappi" src={plus} alt="Lisää vastausvaihtoehto" onClick={(event) => { props.dispatch({ type: 'LISÄÄ_VASTAUS', payload: { kysymysIndex: props.kysymysIndex, kysymys_id: props.kysymys.id } }) }} />
        <img className="Isompi-image-nappi" src={trash} alt="Poista kysymys" onClick={(event) => { props.dispatch({ type: 'POISTA_KYSYMYS', payload: { kysymysIndex: props.kysymysIndex, kysymys: props.kysymys } }) }} />
      </>
        : <><div> {props.kysymys.kys_nimi} </div>
          {props.kysymys.vastaukset.map((vastaus, index) =>
            <div key={index}>
              <Vastaus vastaus={vastaus} dispatch={props.dispatch} kysymysIndex={props.kysymysIndex} vastausIndex={index} moodi={props.moodi} />
            </div>)}</>
      }

    </div>
  );
}

export default Kysymys;
const KirjauduRuutu = (props) => {
  return (
    <div className="KirjauduRuutu">
      <h2>{props.kirjaudu ? "Kirjaudu" : "Rekisteröidy"}</h2>
      <form>
      <label>Käyttäjätunnus: <br/>
        <input type="text" />
      </label><br/>
      <label>Salasana: <br/>
        <input type="text" />
      </label>
    </form>
    <button onClick={(event) => {props.kirjaudu ? props.dispatch({type: 'KIRJAUDU'}) : props.dispatch({type: 'REKISTERÖIDY'})}}>
      {props.kirjaudu ? "Kirjaudu sisään" : "Rekisteröidy"}
    </button>
    </div>
  );
}

export default KirjauduRuutu;
const KirjauduRuutu = (props) => {
  return (
    <div className="KirjauduRuutu">
      <h2>{props.kirjaudu ? "Kirjaudu" : "Rekisteröidy"}</h2>
      <form>
      <label>Käyttäjätunnus: <br/>
        <input type="text" id="Tunnus"/>
      </label><br/>
      <label>Salasana: <br/>
        <input type="text" id="Salasana"/>
      </label><br/>
      {!props.kirjaudu && <label>Admin<input type="checkbox" id="Admin"/></label>}
    </form>
    <button onClick={() => {props.kirjaudu ? props.dispatch({type: 'KIRJAUDU', payload:{
      tunnus: document.getElementById('Tunnus').value, 
      salasana: document.getElementById('Salasana').value, 
    }}) : 
    props.dispatch({type: 'REKISTERÖIDY', 
    payload: {
      tunnus: document.getElementById('Tunnus').value, 
      salasana: document.getElementById('Salasana').value, 
      admin: document.getElementById('Admin').checked
    }})}}>
      {props.kirjaudu ? "Kirjaudu sisään" : "Rekisteröidy"}
    </button>
    </div>
  );
}

export default KirjauduRuutu;
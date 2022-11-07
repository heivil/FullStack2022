const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
})

/* pool.query("DELETE FROM tentit", (err, res) => {
  console.log(err, res)
  pool.end()
}) */

/* for(x=0; x<100; x++){
  pool.query("INSERT INTO tentit (nimi) VALUES ('tentti3')", (err, res) => {
    console.log(err, res)
    if(x===999){pool.end()}
  })
} */

const insertToTable = async (name) => {
  try {
    let res = await pool.query("INSERT INTO tentit (nimi) VALUES ('"+ name +"')")
    console.log(res)

  } catch (err) {
    console.log("Error ", err)
  } 
}

const deleteFromTable = async (name) => {
  try {
    let res = await pool.query("DELETE FROM tentit WHERE nimi= '" + name + "'")
    console.log(res)

  } catch (err) {
    console.log("Error ", err)
  }
}

const changeTableName = async (newName) => {
  try {
    if(typeof(newName) === "string"){
      let res = await pool.query("ALTER TABLE tentterät RENAME TO " + newName)
      console.log(res.rows)
    }
  } catch (err) {
    console.log("Error ", err)
  }
}

const getAllTests = async () =>{
  try {
    let res = await pool.query("SELECT * FROM tentit")
    console.log(res.rows)
  } catch (err) {
    console.log("Error ", err)
  }
}

const getTestById = async (id) =>{
  try {
    let res = await pool.query("SELECT * FROM tentit WHERE id = " + id)
    console.log(res.rows)
  } catch (err) {
    console.log("Error ", err)
  }
}

const getTestsInAlphabeticalOrder = async () =>{
  try {
    let res = await pool.query("SELECT * FROM tentit ORDER BY nimi ASC")
    console.log(res.rows)
  } catch (err) {
    console.log("Error ", err)
  }
}

const getMultipleTestsById = async (first, second, third) =>{

  const text = "SELECT * FROM tentit WHERE id IN ($1, $2, $3)"
  const values = [first, second,third]
  try {
    let res = await pool.query(text, values)
    console.log(res.rows)
  } catch (err) {
    console.log("Error ", err)
  }
}

const getTestsBeforeDate = async (date) =>{
  try {
    let res = await pool.query("SELECT * FROM tentit WHERE pvm < ('" + date +"')")
    console.log(res.rows)
  } catch (err) {
    console.log("Error ", err)
  }
}

const getValidTests = async () =>{
  try {
    let res = await pool.query("SELECT nimi FROM tentit WHERE voimassa = 'true'")
    console.log(res.rows)
  } catch (err) {
    console.log("Error ", err)
  }
}

//insertToTable('testi tentti');
//deleteFromTable('biologian tentti');
//changeTableName('tentit');
//getAllTests();
//getTestById(218);
//getTestsInAlphabeticalOrder();
getMultipleTestsById('220', '221', '219');
//getTestsBeforeDate('2022-10-12');
//getValidTests();

pool.end();
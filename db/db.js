// db.js
const oracledb = require('oracledb');

const dbConfig = {
  user: 'c##db_admin',
  password: 'wail20032020',
  connectString: 'localhost:1521/ORCL' 
};


async function connect() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to Oracle Database');
    return connection ; 
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
}

async function executeQuery(sqlQuery) {
    try {
        const connection = await connect()
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
      const result = await connection.execute(sqlQuery);
      return result.rows;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
    }
  }

  function convertToJSON(result) {
    if (!result.metaData) {
      throw new Error('Metadata not available in query result.');
    }
  
    const jsonResult = result.rows.map(row => {
      const jsonRow = {};
      result.metaData.forEach((meta, index) => {
        jsonRow[meta.name] = row[index];
      });
      return jsonRow;
    });
    return jsonResult;
  }

module.exports = {
  connect,
  executeQuery,
  convertToJSON
};

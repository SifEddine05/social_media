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
      await connection.close()
      return result.rows;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
    }
  }

  async function executeQueryWithbindParams(sqlQuery, bindParams = {}) {
    try {
        const connection = await connect()
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
  
      
  
      
      const result = await connection.execute(sqlQuery, bindParams);
      return result.rows;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
    }
  }
 
module.exports = {
  connect,
  executeQuery,
  executeQueryWithbindParams
};

const { getConnection, connect, executeQuery, convertToJSON } = require('../db/db'); 

const sqlQuery = `SELECT * FROM utilisateurs`;
const get_users = async(req,res,next)=>{
    const result = await executeQuery(sqlQuery);
    console.log(result);
}

module.exports = get_users
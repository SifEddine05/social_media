const { connect, executeQuery } = require('../db/db'); 
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken'); 

const sqlQuery = `SELECT * FROM utilisateurs`;
const get_users = async(req,res,next)=>{
    const result = await executeQuery(sqlQuery);
    console.log(result);
    res.json(result)
}

// Function to sign up a user
async function signUpUser(req, res) {
    const { username, email, password, fullname } = req.body;
  
    try {
      // Establishing connection to the Oracle database
      const connection = await connect()
  
      // Creating a statement for calling the stored function
      const result = await connection.execute(
        `BEGIN
           :result := SignUpUser(:p_username, :p_email, :p_password, :fullname);
         END;`,
        {
          p_username: username,
          p_email: email,
          p_password: password,
          fullname: fullname,
          result: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        }
      );
  
      // Retrieving the result message from the stored function
      const message = result.outBinds.result;
  
      // Sending the response
      res.status(200).json({ message });
  
      // Releasing the connection
      await connection.close();
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'An error occurred during signup.' });
    }
  }

  // Function to sign in a user
async function signInUser(req, res) {
    const { username, password } = req.body;
  
    try {
      // Establishing connection to the Oracle database
      const connection = await connect();
  
      // Creating a statement for calling the stored function
      const result = await connection.execute(
        `BEGIN
           :result := SignInUser(:p_username, :p_password);
         END;`,
        {
          p_username: username,
          p_password: password,
          result: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        }
      );
  
      // Retrieving the result message from the stored function
      const message = result.outBinds.result;
  
      // Checking if sign-in was successful
      if (message === 'Sign-in successful.') {
        // Generating JWT token
        const token = jwt.sign({ username }, 'blancos_zo3ama', { expiresIn: '1h' });
  
        // Sending the token as response
        res.status(200).json({ token });
      } else {
        // Sending the error message as response
        res.status(401).json({ message });
      }
  
      // Releasing the connection
      await connection.close();
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'An error occurred during sign-in.' });
    }
  }


  


  module.exports = {get_users,
    signUpUser, signInUser};
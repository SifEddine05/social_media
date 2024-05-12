// db.js
const oracledb = require('oracledb');

const dbConfig = {
  user: 'c##project',
  password: 'oracle',
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

  async function followUserInDB(followerId, followingId) {
    try {
      const connection = await connect();
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
  
      const result = await connection.execute(
        `BEGIN
           FollowUser(:p_follower_id, :p_following_id);
         END;`,
        {
          p_follower_id: followerId,
          p_following_id: followingId
        }
      );
  
      await connection.commit();
  
      await connection.close();
  
      console.log('User followed successfully');
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }
  async function unFollowUserInDB(followerId, followingId) {
    try {
      const connection = await connect();
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
  
      const result = await connection.execute(
        `BEGIN
           UnfollowUser(:p_follower_id, :p_following_id);
         END;`,
        {
          p_follower_id: followerId,
          p_following_id: followingId
        }
      );
  
      await connection.commit();
  
      await connection.close();
  
      console.log('User followed successfully');
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async function getUserFollowersFromDB(userId) {
    try {
      const connection = await connect();
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
      const result = await connection.execute(
        `BEGIN
           :result := GetUserFollowers(:p_user_id);
         END;`,
        {
          p_user_id: userId,
          result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        }
      );
      const resultSet = result.outBinds.result;
      const rows = await resultSet.getRows();
      await resultSet.close();
  
      await connection.close();

      return rows;
    } catch (error) {
      console.error('Error retrieving user followers:', error);
      throw error;
    }
  }


  async function getUserFollowingsFromDB(userId) {
    try {
      const connection = await connect();
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
      const result = await connection.execute(
        `BEGIN
           :result := GetUserFollowings(:p_user_id);
         END;`,
        {
          p_user_id: userId,
          result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        }
      );
      const resultSet = result.outBinds.result;
      const rows = await resultSet.getRows();
      await resultSet.close();
  
      await connection.close();
  
      return rows;
    } catch (error) {
      console.error('Error retrieving user followers:', error);
      throw error;
    }
  }

  async function likeCommentInDB(userId, commentId) {
    try {
      const connection = await connect();
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
      const result = await connection.execute(
        `BEGIN
           LikeComment(:p_user_id, :p_comment_id);
         END;`,
        {
          p_user_id: userId,
          p_comment_id: commentId
        }
      );
      await connection.commit();
      await connection.close();
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }
  
  
  async function dislikeCommentInDB(userId, commentId) {
    try {
      const connection = await connect();
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
      const result = await connection.execute(
        `BEGIN
           DislikeComment(:p_user_id, :p_comment_id);
         END;`,
        {
          p_user_id: userId,
          p_comment_id: commentId
        }
      );
      await connection.commit();
      await connection.close();
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }
  
  
  

  async function executeQueryWithbindParams(sqlQuery, bindParams = {}) {
    try {
        const connection = await connect()
        console.log(bindParams);
      if (!connection) {
        throw new Error('Connection not established. Call connect() first.');
      }
  
      const options = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true // You can adjust this option based on your requirements
      };
  
      const result = await connection.execute(sqlQuery, bindParams, options);
      return result.rows;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
    }
  }

module.exports = {
  connect,
  executeQuery,
  convertToJSON,
  executeQueryWithbindParams,
  followUserInDB,
  unFollowUserInDB,
  getUserFollowersFromDB,
  getUserFollowingsFromDB,
  likeCommentInDB,
  dislikeCommentInDB
};

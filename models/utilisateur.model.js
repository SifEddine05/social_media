const { getConnection, connect, executeQuery, convertToJSON, executeQueryWithbindParams } = require('../db/db'); 
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken'); 

const sqlQuery = `SELECT * FROM posts`;
const get_users = async(req,res,next)=>{
    const result = await executeQuery(sqlQuery);
    console.log("result",result);
    res.json(result)
}
const getUserProfile = async (req, res, next) => {
    const userId = req.params.userId;
    const sqlQuery = `SELECT user_id, username, email, full_name, bio, nb_followers, nb_followings, nb_posts, profile_picture, created_at FROM utilisateurs WHERE user_id = :userId`;

    try {
        const userProfile = await executeQueryWithbindParams(sqlQuery, { userId: userId });
        if (userProfile && userProfile.length > 0) {
            delete userProfile[0].password;
            const formattedProfile = userProfile.map(row => ({
              user_id: row[0],
              username: row[1],
              email: row[2],
              full_name: row[3],
              bio: row[4],
              nb_followers: row[5],
              nb_followings: row[6],
              nb_posts: row[7],
              profile_picture: row[8],
              created_at: row[9]
            }));
            res.status(200).json(formattedProfile[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMyProfile = async (req, res) => {
  const userId = req.user.message;
  
  const sqlQuery = `SELECT user_id, username, email, full_name, bio, nb_followers, nb_followings, nb_posts, profile_picture, created_at FROM utilisateurs WHERE user_id = :userId`;

  try {
      const userProfile = await executeQueryWithbindParams(sqlQuery, { userId: userId });
      if (userProfile && userProfile.length > 0) {
          const formattedProfile = userProfile.map(row => ({
            user_id: row[0],
            username: row[1],
            email: row[2],
            full_name: row[3],
            bio: row[4],
            nb_followers: row[5],
            nb_followings: row[6],
            nb_posts: row[7],
            profile_picture: row[8],
            created_at: row[9]
          }));
          res.status(200).json(formattedProfile[0]);
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error retrieving user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
 
const getAllUsers= async (req, res) => {
  const sqlQuery = `SELECT user_id, username, email, full_name, bio, nb_followers, nb_followings, nb_posts, profile_picture, created_at FROM utilisateurs`;

  try {
      const allUsers = await executeQuery(sqlQuery);
      if (allUsers && allUsers.length > 0) {
          const formattedUsers = allUsers.map(row => ({
              user_id: row[0],
              username: row[1],
              email: row[2],
              full_name: row[3],
              bio: row[4],
              nb_followers: row[5],
              nb_followings: row[6],
              nb_posts: row[7],
              profile_picture: row[8],
              created_at: row[9]
          }));
          res.status(200).json(formattedUsers);
      } else {
          res.status(404).json({ error: 'No users found' });
      }
  } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


const followUser = async (req, res, next) => {
    const followerId = req.user.message;
    const followingId = req.body.followingId;

    try {
    
        const result = await executeQueryWithbindParams(
            `BEGIN
                FollowUser(:p_follower_id, :p_following_id);
            END;`,
            {
            p_follower_id: followerId,
            p_following_id: followingId
            }
        );

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const unfollowUser = async (req, res, next) => {
    const followerId = req.user.message;
    const followingId = req.body.followingId;

    try {
    
        const result = await executeQueryWithbindParams(
            `BEGIN
                unfollowUser(:p_follower_id, :p_following_id);
            END;`,
            {
            p_follower_id: followerId,
            p_following_id: followingId
            }
        );
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const getUserFollowers = async (req, res, next) => {
    const userId = req.user.message;

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
          const formattedUsers = rows.map(row => ({
            user_id: row[0],
            username: row[1],
            email: row[2],
            full_name: row[4],
            bio: row[5],
            nb_followers: row[6],
            nb_followings: row[7],
            nb_posts: row[8],
            profile_picture: row[9],
            created_at: row[10]
        }));
          await connection.close();
        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error('Error retrieving user followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getUserFollowings = async (req, res, next) => {
    const userId = req.user.message;

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
          //delete rows[0].password;
          await resultSet.close();
          const formattedUsers = rows.map(row => ({
            user_id: row[0],
            username: row[1],
            email: row[2],
            full_name: row[4],
            bio: row[5],
            nb_followers: row[6],
            nb_followings: row[7],
            nb_posts: row[8],
            profile_picture: row[9],
            created_at: row[10]
        }));
          await connection.close();
        res.status(200).json(formattedUsers);
    } catch (error) {
        console.error('Error retrieving user followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//added these 2 
const getUserFollowersById = async (req, res, next) => {
  const userId = req.params.userId;

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
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error retrieving user followers:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getUserFollowingsById = async (req, res, next) => {
  const userId = req.params.userId;

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
       // delete rows[0].password;
        await resultSet.close();
        const formattedUsers = rows.map(row => ({
          user_id: row[0],
          username: row[1],
          email: row[2],
          full_name: row[4],
          bio: row[5],
          nb_followers: row[6],
          nb_followings: row[7],
          nb_posts: row[8],
          profile_picture: row[9],
          created_at: row[10]
      }));
        await connection.close();
      res.status(200).json(formattedUsers);
  } catch (error) {
      console.error('Error retrieving user followers:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

///

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
      console.log(error);
      console.log('Error occurred:', error);
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
      if (message != -1 && message != -2) {
        // Generating JWT token
        const token = jwt.sign({ username, message }, 'blancos_zo3ama', { expiresIn: '30d' });
  
        // Sending the token as response
        res.status(200).json({ token,message });
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
  
  // Function to update username
  async function updateUsername(req, res) {
    const { oldUsername, newUsername } = req.body;
  
    try {

      // Establishing connection to the Oracle database
      const connection = await connect();
  
      result = await connection.execute(
        `BEGIN
           UpdateUsername(:p_old_username, :p_new_username, :p_error_message);
         END;`,
        {
          p_old_username: oldUsername,
          p_new_username: newUsername,
          p_error_message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        }
      );
  
      // Check for custom error message returned by the procedure
      const errorMessage = result.outBinds.p_error_message;
      if (errorMessage) {
          res.status(400).json({ message: errorMessage });
      } else {
          res.status(200).json({ message: 'Username updated successfully.' });
      }
  
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
  }



  // Function to update username
  async function updateEmail(req, res) {
    const { username, newEmail } = req.body;
  
    try {

      // Establishing connection to the Oracle database
      const connection = await connect();
  
      result = await connection.execute(
        `BEGIN
            UpdateEmail(:p_username, :p_new_email, :p_error_message);
         END;`,
        {
          p_username: username,
          p_new_email: newEmail,
          p_error_message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        }
      );
  
      // Check for custom error message returned by the procedure
      const errorMessage = result.outBinds.p_error_message;
      if (errorMessage) {
          res.status(400).json({ message: errorMessage });
      } else {
          res.status(200).json({ message: 'email updated successfully.' });
      }
  
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
  }

  // Function to update username
  async function updatePassword(req, res) {
    const { username, newPassword } = req.body;
  
    try {

      // Establishing connection to the Oracle database
      const connection = await connect();
  
      result = await connection.execute(
        `BEGIN
            UpdatePassword(:p_username, :p_new_password, :p_error_message);
         END;`,
        {
          p_username: username,
          p_new_password: newPassword,
          p_error_message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        }
      );
  
      // Check for custom error message returned by the procedure
      const errorMessage = result.outBinds.p_error_message;
      if (errorMessage) {
          res.status(400).json({ message: errorMessage });
      } else {
          res.status(200).json({ message: 'password updated successfully.' });
      }
  
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  // Function to update username
  async function updateProfile(req, res) {
    const { username, newFullName, newBio } = req.body;
  
    try {

      // Establishing connection to the Oracle database
      const connection = await connect();
  
      result = await connection.execute(
        `BEGIN
            UpdateProfile(:p_username, :p_new_bio, :p_new_full_name, :p_error_message);
         END;`,
        {
          p_username: username,
          p_new_bio: newFullName,
          p_new_full_name: newBio,
          p_error_message: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        }
      );
  
      // Check for custom error message returned by the procedure
      const errorMessage = result.outBinds.p_error_message;
      if (errorMessage) {
          res.status(400).json({ message: errorMessage });
      } else {
          res.status(200).json({ message: 'profile updated successfully.' });
      }
  
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }





  module.exports = {get_users, updateProfile,getUserProfile,updateEmail,updatePassword, followUser, unfollowUser, getUserFollowers, getUserFollowings, getUserFollowings,
    signUpUser, signInUser, updateUsername,getMyProfile,getAllUsers,getUserFollowersById,getUserFollowingsById};

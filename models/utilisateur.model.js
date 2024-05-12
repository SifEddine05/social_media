const { getConnection, connect, executeQuery, convertToJSON, executeQueryWithbindParams, followUserInDB, unFollowUserInDB, getUserFollowersFromDB, getUserFollowingsFromDB } = require('../db/db'); 

const sqlQuery = `SELECT * FROM utilisateurs`;
const get_users = async(req,res,next)=>{
    const result = await executeQuery(sqlQuery);
    console.log("result",result);
}
const getUserProfile = async (req, res, next) => {
    const userId = req.params.userId;
    const sqlQuery = `SELECT user_id, username, email, full_name, bio, nb_followers, nb_followings, nb_posts, profile_picture, created_at FROM utilisateurs WHERE user_id = :userId`;

    try {
        const userProfile = await executeQueryWithbindParams(sqlQuery, { userId: userId });
        if (userProfile && userProfile.length > 0) {
            delete userProfile[0].password;
            res.status(200).json(userProfile[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const followUser = async (req, res, next) => {
    const followerId = req.body.followerId;
    const followingId = req.body.followingId;

    try {
        await followUserInDB(followerId, followingId);
        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const unfollowUser = async (req, res, next) => {
    const followerId = req.body.followerId;
    const followingId = req.body.followingId;

    try {
        await unFollowUserInDB(followerId, followingId);
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const getUserFollowers = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const followers = await getUserFollowersFromDB(userId);
        res.status(200).json(followers);
    } catch (error) {
        console.error('Error retrieving user followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getUserFollowings = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const followings = await getUserFollowingsFromDB(userId);
        res.status(200).json(followings);
    } catch (error) {
        console.error('Error retrieving user followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = {get_users, getUserProfile, followUser, unfollowUser, getUserFollowers, getUserFollowings, getUserFollowings}
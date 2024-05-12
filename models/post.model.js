const { connect, executeQuery } = require('../db/db'); 
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken'); 

const getPostsByUserId = async (req, res) => {
    const getMyPostsQuery = `SELECT * FROM posts WHERE user_id = :user_id`;

    try {
        const connection = await connect();
        const { user_id } = req.params; 
        const binds = [user_id];
        const result = await connection.execute(getMyPostsQuery, binds);
        console.log(result);
        res.json(result.rows); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePostById=async (req,res)=>{
    const deletePostQuery=`BEGIN
    delete_post(1,:post_id);
END;`;
try {
    const connection = await connect();
    const { post_id } = req.params; 
    const binds = [post_id];
    const result = await connection.execute(deletePostQuery, binds);
    console.log("post is deleted");
    console.log(result);
    res.json({ message: 'Post deleted successfully' });
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
}


module.exports = { getPostsByUserId,deletePostById };

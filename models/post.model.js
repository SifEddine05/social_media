const { connect, executeQuery } = require('../db/db'); 
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken'); 
const {  connect, executeQuery, executeQueryWithbindParams } = require('../db/db'); 

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




const getSavedPosts =
`SELECT * FROM (
    SELECT ap.*, ROW_NUMBER() OVER (ORDER BY ap.post_id) AS row_num
    FROM saved_posts ap
    WHERE ap.interaction_source = :user_id
)
WHERE row_num BETWEEN :start_row AND :end_row`;

const get_saved_posts = async(req,res,next)=>{

    const id = req.user.message

    const user_id = id
    const start_row = req.query.start_row;
    const end_row = req.query.end_row ; 
    if(!start_row || !end_row )
    {
        res.status(400).json({"error" : "You must intoduce a start_row and end_row "})
    }
    else {
        const bindParams = {
            user_id: user_id, 
            start_row: start_row,
            end_row: end_row
        };
        const result = await executeQueryWithbindParams(getSavedPosts,bindParams);
        res.status(200).json(result)
    }  
}

module.exports = {
    get_saved_posts,
    getPostsByUserId,deletePostById 
}


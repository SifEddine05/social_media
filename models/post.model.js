const oracledb = require('oracledb');
const jwt = require('jsonwebtoken'); 
const {  connect, executeQuery, executeQueryWithbindParams } = require('../db/db'); 

const getPostsByUserId = async (req, res) => {
   
    const getMyPostsQuery = `
    SELECT p.*, 
           CASE WHEN pi.interaction_type = 'like' THEN 1 ELSE 0 END AS isLiked
      FROM posts p
           LEFT JOIN post_interactions pi 
           ON p.post_id = pi.post_id 
          AND pi.user_id = :user_id
    WHERE p.user_id = :user_id
`;
    
    try {
        const id = req.user.message;
        const user_id = id;
        console.log(user_id);
        const connection = await connect();
        const binds = [user_id, user_id]; // Providing user_id twice for both occurrences in the query
        const result = await connection.execute(getMyPostsQuery, binds);
        const posts = result.rows.map(row => {
            return {
                post_id: row[0],
                user_id: row[1],
                content: row[2],
                image_url: row[3],
                isLiked: row[7], 
                created_at: row[6] 
            };
        });
        

        console.log(posts);
        res.json(posts);  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const deletePostById=async (req,res)=>{
    const id = req.user.message
    const user_id = id
    const deletePostQuery=`BEGIN
    delete_post(:user_id,:post_id);
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


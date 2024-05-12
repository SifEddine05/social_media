const { getConnection, connect, executeQuery, executeQueryWithBinds, executeQueryWithbindParams } = require('../db/db'); 


const getSavedPosts =
`SELECT * FROM (
    SELECT ap.*, ROW_NUMBER() OVER (ORDER BY ap.post_id) AS row_num
    FROM saved_posts ap
    WHERE ap.interaction_source = :user_id
)
WHERE row_num BETWEEN :start_row AND :end_row`;

const get_saved_posts = async(req,res,next)=>{
    const user_id = 1
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
    get_saved_posts
}
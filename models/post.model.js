
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken'); 
const { getConnection, connect, executeQuery, executeQueryWithBinds, executeQueryWithbindParams } = require('../db/db'); 

const getPostsByUserId = async (req, res) => {
    
    try {
        const {user_id} = req.query
        if(!user_id)
        {
            res.status(400).json({"error":"user_id is required"})
        }
        const { page } = req.query;
        if(!page){
            res.status(400).json({"error":"the number of page is required "})
        }
        const v_page_number = page;
        const connection = await connect()

        const query = `BEGIN :v_cursor := get_user_posts_func(:v_user_id, :v_page_number); END;`;

        const bindVars = {
            v_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            v_user_id: user_id,
            v_page_number: v_page_number
        };

        const result = await connection.execute(query, bindVars);
        const cursor = result.outBinds.v_cursor;
        const rows = await cursor.getRows()
        
        await cursor.close();
        const jsonResult = rows.map(element => JSON.parse(element[0]));
        res.json(jsonResult);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
};




const get_saved_posts = async(req,res,next)=>{
    try{

        const id = req.user.message

        const user_id = id
        const start_row = req.query.start_row;
        const end_row = req.query.end_row ; 
        if(!start_row || !end_row )
        {
            res.status(400).json({"error" : "You must intoduce a start_row and end_row "})
        }
        else {
            const connection = await connect()

            const query = `BEGIN :v_cursor := get_saved_posts_func(:v_user_id, :start_row, :end_row); END;`;

            const bindVars = {
                v_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                v_user_id: user_id,
                start_row: start_row,
                end_row: end_row
            };

            const result = await connection.execute(query, bindVars);
            const cursor = result.outBinds.v_cursor;
            const rows = await cursor.getRows()
            
            await cursor.close();
            const jsonResult = rows.map(element => JSON.parse(element[0]));
            res.json(jsonResult);
        } 
    }
    catch(error){
        res.status(400).json({ error:  error.message  });
    } 
}




const addPostQuery = `
BEGIN
    add_post(:user_id, :content, :image);
END;
`

const add_post = async(req,res,next)=>{
    try{
        const id = req.user.message

        const user_id = id
        const { content } = req.body;
        
        if(!content )
        {
            res.status(400).json({"error" : "You must intoduce content  "})
        }
        else {
            const bindParams = {
                user_id: user_id, 
                content:content,
                image: "sss.com"
            };
            const result = await executeQueryWithbindParams(addPostQuery,bindParams);
            res.status(200).json("the post is added successfully")
        }  
    }
    catch(error){
        res.status(400).json({ error:  error.message  });
    }
}





const updatePostQuery = `
BEGIN
    modify_post(:user_id, :post_id, :content, NULL);
END;
`
const update_post = async(req,res,next) =>{
    try{
        const id = req.user.message

        const user_id = id
        const { post_id,content } = req.body;
        
        if(!content || !post_id)
        {
            res.status(400).json({"error" : "You must intoduce content  and post_id"})
        }
        else {
            const bindParams = {
                user_id: user_id, 
                post_id:post_id,
                content : content
            };
            // await executeQuery(addPostQuery)
            const result = await executeQueryWithbindParams(updatePostQuery,bindParams);
            res.status(200).json("the post is updated successfully")
        }  
    }
    catch(error){
        res.status(400).json({ error:  error.message  });
    }
}





const executeGetRecentPostsFunc = async (req, res) => {
    try {
        const v_user_id = req.user.message; 
        const { page } = req.query;
        if(!page){
            res.status(400).json({"error":"the number of page is required "})
        }
        const v_page_number = page;
        const connection = await connect()

        const query = `BEGIN :v_cursor := get_recent_posts_func(:v_user_id, :v_page_number); END;`;

        const bindVars = {
            v_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            v_user_id: v_user_id,
            v_page_number: v_page_number
        };

        const result = await connection.execute(query, bindVars);
        const cursor = result.outBinds.v_cursor;
        const rows = await cursor.getRows()
        
        await cursor.close();
        const jsonResult = rows.map(element => JSON.parse(element[0]));
        res.json(jsonResult);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
};




const getPostCommentsWithRepliesQuery = `
BEGIN
    :cursor := get_comments_with_replies_func(:p_post_id, :p_page_number, :p_user_id);
END;
    
`;

const getpostcomments = async (req, res) => {
    try {
        // Extract the post_id and page_number from the request query
        const { post_id, page_number } = req.query;
        const id = req.user.message
        const connection = await connect();

        if (!post_id || !page_number) {
            res.status(400).json({ "error": "post_id and page_number are required " });
            return;
        }

        // Bind parameters
        const bindParams = {
            cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_post_id: post_id,
            p_page_number: page_number,
            p_user_id : id
        };

        // Execute the PL/SQL function
        const result = await connection.execute(getPostCommentsWithRepliesQuery, bindParams);
        // Fetch the result cursor
        const cursor = result.outBinds.cursor;

        // Process the cursor
        const comments = await cursor.getRows()

        // Close the cursor
        await cursor.close();
        
        // Send the result to the client
        res.json(JSON.parse(comments));
    } catch (error) {
        console.error('Error executing get_comments_with_replies_func:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};






const deletePostById=async (req,res)=>{
const deletePostQuery=
`BEGIN
    delete_post(:user_id,:post_id);
END;`;
try {
    const id = req.user.message
    const { post_id } = req.params; 
    const binds = {
        user_id :id ,
        post_id : post_id
    };
    const result = await executeQueryWithbindParams(deletePostQuery,binds)
    res.json({ message: 'Post deleted successfully' });
   } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
}


const getmyposts = async (req,res,next)=>
{
    try {
        const v_user_id = req.user.message; 
        const { page } = req.query;
        if(!page){
            res.status(400).json({"error":"the number of page is required "})
        }
        const v_page_number = page;
        const connection = await connect()

        const query = `BEGIN :v_cursor := get_user_posts_func(:v_user_id, :v_page_number); END;`;

        const bindVars = {
            v_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            v_user_id: v_user_id,
            v_page_number: v_page_number
        };

        const result = await connection.execute(query, bindVars);
        const cursor = result.outBinds.v_cursor;
        const rows = await cursor.getRows()
        
        await cursor.close();
        const jsonResult = rows.map(element => JSON.parse(element[0]));
        res.json(jsonResult);
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }

}


const likePost=async (req,res)=>{
    const likePostQuery=
    `BEGIN
        SP_LikePost(:user_id, :post_id);
    END;`;
    try {
        const id = req.user.message
        const { post_id } = req.body; 

         if (!post_id ) {
            res.status(400).json({ "error": "post_id is required " });
            return;
        }
        const binds = {
            user_id :id ,
            post_id : post_id
        };
        const result = await executeQueryWithbindParams(likePostQuery,binds)
        res.json({ message: 'Post liked successfully' });
       } catch (error) {
        console.error(error);
        res.status(500).json({ "error":error.message });
    }
}

const savePost=async (req,res)=>{
    const savePostQuery=
    `BEGIN
    SP_SavePost(:user_id, :post_id);
    END;`;
    try {
        const id = req.user.message
        const { post_id } = req.body; 

         if (!post_id ) {
            res.status(400).json({ "error": "post_id is required " });
            return;
        }
        const binds = {
            user_id :id ,
            post_id : post_id
        };
        const result = await executeQueryWithbindParams(savePostQuery,binds)
        res.json({ message: 'Post saved successfully' });
       } catch (error) {
        console.error(error);
        res.status(500).json({ "error":error.message });
    }
}



const commentPost=async (req,res)=>{
    const commentPostQuery=
    `BEGIN
    SP_CommentOnPost(:user_id, :post_id,:content);
        
    END;`;
    try {
        const id = req.user.message
        const { post_id,content } = req.body; 

         if (!post_id || !content) {
            res.status(400).json({ "error": "post_id and content are required " });
            return;
        }
        const binds = {
            user_id :id ,
            post_id : post_id,
            content : content
        };
        const result = await executeQueryWithbindParams(commentPostQuery,binds)
        res.json({ message: 'comment added successfully' });
       } catch (error) {
        console.error(error);
        res.status(500).json({ "error":error.message });
    }
}


const searchAccount=async (req,res)=>{
    const searchAccountQuery=
    `BEGIN
    SP_SearchAccount(:search_query, :results);
  END;`;
    try {
        const id = req.user.message
        const { searchQuery } = req.query; 

         if (!searchQuery) {
            res.status(400).json({ "error": "searchQuery is required " });
            return;
        }
        let resultsCursor = {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR
        };
      
          // Bind parameters
        const binds = {
        search_query: searchQuery,
        results: resultsCursor
        };
        const connection = await connect()
        const result = await connection.execute(searchAccountQuery, binds);      
        const resultSet = result.outBinds.results;
        const data = await resultSet.getRows()
        console.log(data);

        res.json({ data });
       } catch (error) {
        console.error(error);
        res.status(500).json({ "error":error.message });
    }
}



const UnlikePost=async (req,res)=>{
    const likePostQuery=
    `BEGIN
        SP_DislikePost(:user_id, :post_id);
    END;`;
    try {
        const id = req.user.message
        const { post_id } = req.body; 

         if (!post_id ) {
            res.status(400).json({ "error": "post_id is required " });
            return;
        }
        const binds = {
            user_id :id ,
            post_id : post_id
        };
        const result = await executeQueryWithbindParams(likePostQuery,binds)
        res.json({ message: 'Post Unliked successfully' });
       } catch (error) {
        console.error(error);
        res.status(500).json({ "error":error.message });
    }
}





const UnsavePost=async (req,res)=>{
    const UnsavePostQuery=
    `BEGIN
    SP_UnsavePost(:user_id, :post_id);
    END;`;
    try {
        const id = req.user.message
        const { post_id } = req.body; 

         if (!post_id ) {
            res.status(400).json({ "error": "post_id is required " });
            return;
        }
        const binds = {
            user_id :id ,
            post_id : post_id
        };
        const result = await executeQueryWithbindParams(UnsavePostQuery,binds)
        res.json({ message: 'Post Unsaved successfully' });
       } catch (error) {
        console.error(error);
        res.status(500).json({ "error":error.message });
    }
}


module.exports = {
    get_saved_posts,
    add_post,
    update_post,
    executeGetRecentPostsFunc,
    getpostcomments,
    getPostsByUserId,
    deletePostById,
    getmyposts,
    likePost,
    savePost,
    commentPost,
    searchAccount,
    UnlikePost,
    UnsavePost
}

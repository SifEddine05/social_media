const { likeCommentInDB, dislikeCommentInDB, executeQueryWithbindParams } = require('../db/db'); 


const likeComment = async (req, res, next) => {
    const { commentId } = req.body; 
    const userId = req.user.message;
    try {
        await executeQueryWithbindParams(
            `BEGIN
               LikeComment(:p_user_id, :p_comment_id);
             END;`,
            {
              p_user_id: userId,
              p_comment_id: commentId
            }
          );
        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const dislikeComment = async (req, res, next) => {
    const { commentId } = req.body; 
    const userId = req.user.message;
    try {
        await executeQueryWithbindParams(
            `BEGIN
               DisikeComment(:p_user_id, :p_comment_id);
             END;`,
            {
              p_user_id: userId,
              p_comment_id: commentId
            }
          );
        res.status(200).json({ message: 'Comment disliked successfully' });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const replyCommentQuery = `
      BEGIN
        create_reply(:user_id, :parent_comment_id, :reply_content);
      END;
    `;
const replyComment = async (req, res, next) => {
    const {  commentId,content } = req.body; 
    try {
        const user_id = req.user.message

        if(!content || !commentId )
            {
                res.status(400).json({"error" : "You must intoduce content  and commentId"})
            }
            else {
                const bindParams = {
                    user_id: user_id, 
                    parent_comment_id:commentId,
                    reply_content:content
                };
                const result = await executeQueryWithbindParams(replyCommentQuery,bindParams);
                console.log(result);
                res.status(200).json({ message: 'Comment reply created successfully' });

            }  
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
}



const updateCommentQuery = `
BEGIN
    modify_comment(:user_id,:comment_id,:content);
END;
    `;
const updateComment = async (req, res, next) => {
    const {  commentId,content } = req.body; 
    try {
        const user_id = req.user.message

        if(!content || !commentId )
            {
                res.status(400).json({"error" : "You must intoduce content  and commentId"})
            }
            else {
                const bindParams = {
                    user_id: user_id, 
                    comment_id:commentId,
                    content:content
                };
                const result = await executeQueryWithbindParams(updateCommentQuery,bindParams);
                res.status(200).json({ message: 'Comment updated successfully' });

            }  
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
}


const deleteCommentQuery = `
BEGIN
    delete_comment(:user_id,:comment_id);
END;
    `;
const deleteComment = async (req, res, next) => {
    const {  commentId } = req.params; 
    try {
        const user_id = req.user.message

        if(!commentId )
            {
                res.status(400).json({"error" : "You must intoduce a commentId"})
            }
            else {
                const bindParams = {
                    user_id: user_id, 
                    comment_id:commentId,
                };
                const result = await executeQueryWithbindParams(deleteCommentQuery,bindParams);
                res.status(200).json({ message: 'Comment deleted successfully' });

            }  
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
}


module.exports = {likeComment, dislikeComment,replyComment,updateComment,deleteComment}
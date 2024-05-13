const { likeCommentInDB, dislikeCommentInDB, executeQueryWithbindParams } = require('../db/db'); 


const likeComment = async (req, res, next) => {
    const { userId, commentId } = req.body; 
    try {
        await likeCommentInDB(userId, commentId);
        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const dislikeComment = async (req, res, next) => {
    const { userId, commentId } = req.body; 
    try {
        await dislikeCommentInDB(userId, commentId);
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


module.exports = {likeComment, dislikeComment,replyComment}
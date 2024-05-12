const { executeQueryWithbindParams } = require('../db/db'); 


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


module.exports = {likeComment, dislikeComment}
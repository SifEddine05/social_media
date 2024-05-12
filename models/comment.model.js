const { likeCommentInDB, dislikeCommentInDB } = require('../db/db'); 


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


module.exports = {likeComment, dislikeComment}
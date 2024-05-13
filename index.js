const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { connect } = require('./db/db'); 
const utilisateurRouter = require("./routes/utilisateur.route");
const CommentRouter = require("./routes/comment.route");
const { postRouter } = require("./routes/post.route");



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  
 
  app.use("/", utilisateurRouter);
  app.use("/",postRouter)
  app.use("/", CommentRouter);

  app.use(async (err, req, res, next) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


  connect()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error starting server:', err);
  });

  
  
  module.exports = app;
const express = require("express");
const massive = require("massive");
const users = require("../controllers/users");
const post = require("../controllers/posts");
const comment = require("../controllers/comments");

massive({
  host: "localhost",
  port: 5432,
  database: "node3",
  user: "postgres",
  password: "node3db"
}).then(db => {
  const app = express();

  app.set("db", db);

  app.use(express.json());

  //USERS
  app.post("/api/users", users.create);
  app.get("/api/users", users.list);
  app.get("/api/users/:id", users.getById);
  app.get("/api/users/:id/profile", users.getProfile);

  //POSTS
  app.post("/posts", post.createPost);
  app.get("/user/:userId/posts", post.postPerUser);
  app.get("/posts/:id", post.fetchAPost);
  app.patch("/update-posts/:id", post.updatePost);

  //COMMENTS
  app.post("/comment", comment.createComment);
  app.patch("/update-comment/:id", comment.editComment);

  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

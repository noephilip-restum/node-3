module.exports = {
  createPost: (req, res) => {
    const db = req.app.get("db");

    const { userId, content } = req.body;

    db.posts
      .insert(
        { userId, content },
        {
          deepInsert: true
        }
      )
      .then(post => res.status(201).json(post))
      .catch(err => {
        console.error(err);
      });
  },
  postPerUser: (req, res) => {
    const db = req.app.get("db");
    db.posts
      .find({ userId: req.params.userId })
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },
  fetchAPost: (req, res) => {
    const db = req.app.get("db");
    const { comments } = req.query;

    db.posts.find(req.params.id).then(post => {
      comments
        ? db.comments
            .find({ postId: req.params.id })
            .then(comment =>
              res.status(200).json({ post: post, comments: comment })
            )
        : res.status(500).end();
    });
  },
  updatePost: (req, res) => {
    const db = req.app.get("db");
    const content = req.body;
    const id = req.params.id;

    db.posts
      .update(id, content)
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }
};

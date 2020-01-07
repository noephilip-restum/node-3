module.exports = {
  createComment: (req, res) => {
    const db = req.app.get("db");
    const { userId, postId, comment } = req.body;

    db.comments
      .insert(
        {
          userId,
          postId,
          comment
        },
        {
          deepInsert: true
        }
      )
      .then(comment => res.status(201).json(comment))
      .catch(err => {
        console.error(err);
      });
  },
  editComment: (req, res) => {
    const db = req.app.get("db");
    const comment = req.body;
    const id = req.params.id;

    db.comments
      .update(id, comment)
      .then(comment => res.status(200).json(comment))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }
};

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const secret = require("../secret");

module.exports = {
  create: (req, res) => {
    const db = req.app.get("db");
    const { email, password } = req.body;

    argon2
      .hash(password)
      .then(hash => {
        return db.users.insert(
          {
            email,
            password: hash,
            user_profiles: [
              {
                userId: undefined,
                about: null,
                thumbnail: null
              }
            ]
          },
          {
            fields: ["id", "email"]
          }
        );
      })
      .then(user => {
        const token = jwt.sign({ userId: user.id }, secret);
        res.status(201).json({ ...user, token });
      })
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },
  list: (req, res) => {
    const db = req.app.get("db");

    if (!req.headers.authorization) {
      return res.status(401).end();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, secret);

      db.users
        .find()
        .then(users => res.status(200).json(users))
        .catch(err => {
          console.error(err);
          res.status(500).end();
        });
    } catch (err) {
      console.error(err);
      res.status(401).end();
    }
  },
  getById: (req, res) => {
    const db = req.app.get("db");

    if (!req.headers.authorization) {
      return res.status(401).end();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, secret);
      db.users
        .findOne(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(err => {
          console.error(err);
          res.status(500).end();
        });
    } catch (err) {
      console.error(err);
      res.status(401).end();
    }
  },
  getProfile: (req, res) => {
    const db = req.app.get("db");

    if (!req.headers.authorization) {
      return res.status(401).end();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, secret);
      db.user_profiles
        .findOne({
          userId: req.params.id
        })
        .then(profile => res.status(200).json(profile))
        .catch(err => {
          console.error(err);
          res.status(500).end();
        });
    } catch (err) {
      console.error(err);
      res.status(401).end();
    }
  }
};

const router = require("express").Router();
const db = require("../database/db");
const tokenVerifier = require("../utils/tokenVerifyMiddleware");

//get comment likers
router.get("/likers/:comment_uid", (req, res) => {
  db.query(
    `SELECT username,profile_image_url FROM users WHERE (uid)::text IN 
    (SELECT unnest(likers) FROM comments WHERE (comment_uid)::text='${req.params.comment_uid}')
  `,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//delete comment
router.post("/delete", tokenVerifier, (req, res) => {
  db.query(`DELETE FROM comments WHERE (comment_uid)::text='${req.body.comment_uid}'`, (err, res1) => {
    if (!err) res.send("success");
    else throw err;

    db.query(`DELETE FROM notifications WHERE (comment_uid)::text='${req.body.comment_uid}'`);
  });
});

//like comment
router.post("/like", tokenVerifier, (req, res) => {
  db.query(
    `UPDATE comments SET likers=array_append(likers,'${req.body.liker_uid}') 
  WHERE (comment_uid)::text='${req.body.comment_uid}'`,
    (err, res1) => {
      if (!err) res.send("success");
      else throw err;
    }
  );
});

//unlike comment
router.post("/unlike", tokenVerifier, (req, res) => {
  db.query(
    `UPDATE comments SET likers=array_remove(likers,'${req.body.unliker_uid}') 
  WHERE (comment_uid)::text='${req.body.comment_uid}'`,
    (err, res1) => {
      if (!err) res.send("success");
      else throw err;
    }
  );
});

//get comments for selected post
router.get("/getComments/:post_uid", (req, res) => {
  const user_uid = getFromHeader(req.headers, "uid") || "09bdd5a4-4cdd-3ae1-9122-dfb66f8afc23";

  db.query(
    `SELECT username as poster_username,
    comment_uid,
    post_owner_uid,
    '${user_uid}'=ANY(likers) AS liked_by_me,
  profile_image_url as poster_profile_image,array_length(likers,1) as comment_likes_count,comment,posted_date
  FROM comments INNER JOIN users ON (comments.commenter_uid)=(users.uid)::text
  WHERE post_uid='${req.params.post_uid}'`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

router.post("/addComment", tokenVerifier, (req, res) => {
  db.query(
    `INSERT INTO comments(comment,commenter_uid,post_uid,post_owner_uid,posted_date)
    VALUES('${req.body.comment}','${req.body.commenter_uid}',
    '${req.body.post_uid}','${req.body.post_owner_uid}','${req.body.posted_date}')
    returning comment_uid`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;

      if (req.body.commenter_uid !== req.body.post_owner_uid) {
        db.query(
          `INSERT INTO notifications(notification,owner_uid,interactor_uid,date,post_uid,comment_uid)
            VALUES('comment added',
            '${req.body.post_owner_uid}','${req.body.commenter_uid}','${new Date()}','${req.body.post_uid}','${
            res1.rows[0].comment_uid
          }'  )`
        );
      }
    }
  );
});

module.exports = router;

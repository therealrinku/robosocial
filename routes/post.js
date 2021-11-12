const router = require("express").Router();
const db = require("../database/db");

//get posts for explore page
router.get("/exploreposts", (req, res) => {
  db.query(
    `SELECT post_id,image_url as post_image,posted_date as post_posted_date FROM posts order BY posted_date`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//get selected post
router.get("/getpost/:post_id/:current_user_uid", (req, res) => {
  db.query(
    `SELECT 
    '${req.params.current_user_uid}' = ANY (likers) AS liked_by_me,
    (post_uid)::text=ANY(SELECT unnest(saved_posts_uids) FROM users WHERE uid='${req.params.current_user_uid}') 
    AS i_have_saved,
    (SELECT CAST(COUNT(*) AS int) FROM comments WHERE (post_uid)::uuid=posts.post_uid) AS post_comments_count,
    '${req.params.current_user_uid}'=ANY(followers) AS followed_by_me,
    post_uid,username as poster_username,
    post_id,
    owner_uid as poster_uid,
    profile_image_url as poster_profileImage,
    image_url as post_image,
    array_length(likers,1) as post_likes_count,
    posted_date as post_posted_date,
    status as post_status
    FROM posts INNER JOIN users ON (posts.owner_uid)=(users.uid)::text 
    WHERE (post_id)::text='${req.params.post_id}'`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//get saved posts
router.get("/savedposts/:current_user_uid", (req, res) => {
  db.query(
    `SELECT post_id,image_url as post_image FROM posts WHERE (post_uid)::text
    IN (SELECT unnest(saved_posts_uids) 
    FROM users WHERE (uid)::text='${req.params.current_user_uid}')`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//get visited profile posts
router.get("/posts/:current_user_uid/:owner_uid", (req, res) => {
  db.query(
    `SELECT 
    '${req.params.current_user_uid}' = ANY (likers) AS liked_by_me,
    (post_uid)::text=ANY(SELECT unnest(saved_posts_uids) FROM users WHERE uid='${req.params.current_user_uid}') 
    AS i_have_saved,
    post_uid,username as poster_username,
    post_id,
    profile_image_url as poster_profileImage,
    image_url as post_image,
    array_length(likers,1) as post_likes_count,
    posted_date as post_posted_date,
    status as post_status
    FROM posts INNER JOIN users ON (posts.owner_uid)=(users.uid)::text 
    WHERE posts.owner_uid='${req.params.owner_uid}'
    `,
    (err, res0) => {
      if (err) throw err;
      else res.send(res0.rows);
    }
  );
});

//upload post
router.post("/upload/new", (req, res) => {
  db.query(
    `INSERT INTO posts(owner_uid,image_url,status,posted_date) 
      VALUES('${req.body.owner_uid}','${req.body.image_url}',
      '${req.body.status}','${new Date()}') returning post_id,post_uid`,
    (err, res1) => {
      if (!err) {
        res.send(res1.rows);
      } else throw err;
    }
  );
});

//delete post
router.post("/delete", (req, res) => {
  db.query(
    `DELETE FROM posts WHERE post_uid='${req.body.post_uid}'`,
    (err, res1) => {
      if (!err) res.send("done");
      else throw err;

      db.query(
        `DELETE FROM notifications WHERE post_uid='${req.body.post_uid}'`
      );
    }
  );
});

//get post likers
router.get("/likers/:post_uid", (req, res) => {
  db.query(
    `SELECT username,profile_image_url FROM users WHERE (uid)::text IN 
    (SELECT unnest(likers) FROM posts WHERE (post_uid)::text='${req.params.post_uid}')
  `,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//unsave post
router.post("/unsave", (req, res) => {
  db.query(
    `UPDATE users SET saved_posts_uids=array_remove(saved_posts_uids,'${req.body.post_uid}')
        WHERE username='${req.body.unsaver_username}'`,
    (err, res1) => {
      if (!err) res.send("done");
      else throw err;
    }
  );
});

//save post
router.post("/save", (req, res) => {
  db.query(
    `UPDATE users SET saved_posts_uids=array_append(saved_posts_uids,'${req.body.post_uid}')
      WHERE username='${req.body.saver_username}'`,
    (err, res1) => {
      if (!err) res.send("done");
      else throw err;
    }
  );
});

//unlike post
router.post("/unlike", (req, res) => {
  db.query(
    `UPDATE posts SET likers=array_remove(likers,'${req.body.unliker_uid}') WHERE post_uid='${req.body.post_uid}'`,
    (err, _) => {
      if (!err) res.send("done");
      else throw err;

      db.query(
        `DELETE FROM notifications WHERE interactor_uid='${req.body.unliker_uid}' 
        AND post_uid='${req.body.post_uid}'
        AND notification='like post'`
      );
    }
  );
});

//like post
router.post("/like", (req, res) => {
  db.query(
    `UPDATE posts SET likers=array_append(likers,'${req.body.liker_uid}') WHERE post_uid='${req.body.post_uid}'`,
    (err, _) => {
      if (!err) res.send("done");
      else throw err;

      if (req.body.liker_uid !== req.body.post_owner_uid) {
        db.query(
          `INSERT INTO notifications(notification,owner_uid,interactor_uid,post_uid,date)
              VALUES('like post',
              '${req.body.post_owner_uid}','${req.body.liker_uid}','${
            req.body.post_uid
          }','${new Date()}')`
        );
      }
    }
  );
});

//undislike post
router.post("/undislike", (req, res) => {
  db.query(
    `UPDATE posts SET dislikers=array_remove(dislikers,'${req.body.undisliker_uid}') WHERE post_uid='${req.body.post_uid}'`,
    (err, _) => {
      if (!err) res.send("done");
      else throw err;

      db.query(
        `DELETE FROM notifications WHERE interactor_uid='${req.body.undisliker_uid}' 
        AND post_uid='${req.body.post_uid}'
        AND notification='dislike post'`
      );
    }
  );
});

//dislike post
router.post("/dislike", (req, res) => {
  db.query(
    `UPDATE posts SET dislikers=array_append(dislikers,'${req.body.disliker_uid}') WHERE post_uid='${req.body.post_uid}'`,
    (err, _) => {
      if (!err) res.send("done");
      else throw err;

      if (req.body.disliker_uid !== req.body.post_owner_uid) {
        db.query(
          `INSERT INTO notifications(notification,owner_uid,interactor_uid,post_uid,date)
              VALUES('dislike post',
              '${req.body.post_owner_uid}','${req.body.disliker_uid}','${
            req.body.post_uid
          }','${new Date()}')`
        );
      }
    }
  );
});

//getFeed
router.get("/feed/:user_uid", (req, res) => {
  db.query(
    `SELECT 
    '${req.params.user_uid}' = ANY (likers) AS liked_by_me,
    (post_uid)::text=ANY(SELECT unnest(saved_posts_uids) FROM users WHERE uid='${req.params.user_uid}') AS i_have_saved,
    (SELECT CAST(COUNT(*) AS int) FROM comments WHERE (post_uid)::uuid=posts.post_uid) AS post_comments_count,
    post_uid,username as poster_username,
    post_id,
    true as inFeed,
    profile_image_url as poster_profileImage,
    image_url as post_image,
    owner_uid as poster_uid,
    array_length(likers,1) as post_likes_count,
    posted_date as post_posted_date,
    status as post_status
    FROM posts INNER JOIN users ON (posts.owner_uid)=(users.uid)::text 
    WHERE posts.owner_uid=ANY(SELECT unnest(array_append(following,'${req.params.user_uid}')) 
    FROM users WHERE uid='${req.params.user_uid}')
    `,
    (err, res0) => {
      if (err) {
        throw err;
      } else {
        res.send(res0.rows);
      }
    }
  );
});

module.exports = router;

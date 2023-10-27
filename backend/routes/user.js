const db = require("../database/db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const tokenVerifier = require("../utils/tokenVerifyMiddleware");
const getFromHeader = require("../utils/getFromHeader");

router.get("/getBanner", async (_, res) => {
  const resp = await (
    await fetch("https://nerdev-plum.vercel.app/api/data", {
      headers: {
        "x-content-key": process.env.BANNER_API_KEY,
      },
    })
  ).json();

  res.status(200).json(resp.data);
});

//update password
router.post("/updatePassword", tokenVerifier, (req, res) => {
  db.query(`SELECT password FROM users WHERE (uid)::text='${req.body.userUid}'`, (err, res1) => {
    bcrypt.compare(req.body.initialPassword, res1.rows[0].password, (err2, result) => {
      if (result) {
        bcrypt.hash(req.body.newPassword, 10, (err2, hash) => {
          db.query(`UPDATE users SET password='${hash}' WHERE (uid)::text ='${req.body.userUid}'`, (err3, res2) => {
            res.send("success");
          });
        });
      } else {
        res.send("current password doesnot match.");
      }
    });
  });
});

//update profile picture
router.post("/updateProfilePicture", tokenVerifier, (req, res) => {
  db.query(
    `UPDATE users SET profile_image_url='${req.body.imageUrl}' WHERE (uid)::text='${req.body.userUid}'`,
    (err, res1) => {
      if (!err) res.send("done");
      else throw err;
    }
  );
});

//get notifications
router.get("/getNotifications/:user_uid", tokenVerifier, (req, res) => {
  const user_uid = getFromHeader(req.headers, "uid") || "09bdd5a4-4cdd-3ae1-9122-dfb66f8afc23";

  db.query(
    `SELECT posts.post_id as post_id,image_url as post_image,
    username,
    notifications.notification_uid as uid,notification,
    date,profile_image_url FROM notifications 
    LEFT JOIN users ON users.uid=(notifications.interactor_uid)::uuid
    LEFT JOIN posts ON posts.post_uid=(notifications.post_uid)::uuid
    WHERE notifications.owner_uid='${user_uid}'`,
    (err, res0) => {
      if (err) console.log(err);
      if (!err) res.send(res0.rows);
    }
  );
});

//update profile
router.post("/updateProfile", tokenVerifier, (req, res) => {
  db.query(`SELECT username FROM users WHERE username='${req.body.username}'`, (err, res1) => {
    if (res1.rows.length <= 0 || req.body.initial_username === `${req.body.username}`) {
      db.query(
        `UPDATE users SET username='${req.body.username}',email='${req.body.email}',bio='${req.body.bio}'
          WHERE username='${req.body.initial_username}'`,
        (err2, res2) => {
          if (!err2) res.send("success");
          else throw err2;
        }
      );
    } else {
      res.send("username taken");
    }
  });
});

//get recommended users
router.get("/getRecommendedUsers", (req, res) => {
  const user_uid = getFromHeader(req.headers, "uid") || "09bdd5a4-4cdd-3ae1-9122-dfb66f8afc23";

  db.query(
    `SELECT username,profile_image_url,uid,
    ${false} as i_am_following
    FROM users WHERE (uid)::text NOT IN (SELECT unnest(following) 
    FROM users WHERE (uid)::text='${user_uid}') 
    AND 
    uid !='${user_uid}' LIMIT 15 `,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//get searched users
router.get("/search/:search_query", (req, res) => {
  db.query(
    `SELECT username,profile_image_url FROM users WHERE username LIKE '%${req.params.search_query}%' `,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//get following
router.get("/followings/:username", (req, res) => {
  db.query(
    `SELECT username,profile_image_url FROM users WHERE (uid)::text
    IN (SELECT unnest(following) FROM users WHERE username='${req.params.username}')`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//get followers
router.get("/followers/:username", (req, res) => {
  db.query(
    `SELECT username,profile_image_url FROM users WHERE (uid)::text
    IN (SELECT unnest(followers) FROM users WHERE username='${req.params.username}')`,
    (err, res1) => {
      if (!err) res.send(res1.rows);
      else throw err;
    }
  );
});

//unfollow
const RemoveFollowing = (unfollowing_user_uid, unfollower_user_uid) => {
  return new Promise((resolve) => {
    db.query(
      `UPDATE users SET following=array_remove(following,'${unfollowing_user_uid}')
		 WHERE uid='${unfollower_user_uid}'`,
      (err, res0) => {
        if (!err) {
          resolve("done");
        } else {
          throw err;
        }
      }
    );
  });
};

const RemoveFollower = (unfollowing_user_uid, unfollower_user_uid) => {
  return new Promise((resolve) => {
    db.query(
      `UPDATE users SET followers=array_remove(followers,'${unfollower_user_uid}')
		   WHERE uid='${unfollowing_user_uid}'`,
      (err, res0) => {
        if (!err) {
          resolve("done");
        } else {
          throw err;
        }
      }
    );
  });
};

router.post("/unfollow", tokenVerifier, (req, res) => {
  RemoveFollowing(req.body.unfollowing_user_uid, req.body.unfollower_user_uid)
    .then((res0) => {
      if (res0 === "done") {
        RemoveFollower(req.body.unfollowing_user_uid, req.body.unfollower_user_uid)
          .then((res1) => {
            if (res1 === "done") {
              res.send("done");
            }
            db.query(
              `DELETE FROM notifications WHERE interactor_uid='${req.body.unfollower_user_uid}' AND
              owner_uid='${req.body.unfollowing_user_uid}' AND notification='follow'`
            );
          })
          .catch((err1) => {
            throw err1;
          });
      }
    })
    .catch((err) => {
      throw err;
    });
});

//follow
const AddFollowing = (following_user_uid, follower_user_uid) => {
  return new Promise((resolve) => {
    db.query(
      `UPDATE users SET following=array_append(following,'${following_user_uid}')
		 WHERE uid='${follower_user_uid}'`,
      (err, res0) => {
        if (!err) {
          resolve("done");
        } else {
          throw err;
        }
      }
    );
  });
};

const AddFollower = (following_user_uid, follower_user_uid) => {
  return new Promise((resolve) => {
    db.query(
      `UPDATE users SET followers=array_append(followers,'${follower_user_uid}')
		   WHERE uid='${following_user_uid}'`,
      (err, res0) => {
        if (!err) {
          resolve("done");
        } else {
          throw err;
        }
      }
    );
  });
};

router.post("/follow", tokenVerifier, (req, res) => {
  AddFollowing(req.body.following_user_uid, req.body.follower_user_uid)
    .then((res0) => {
      if (res0 === "done") {
        AddFollower(req.body.following_user_uid, req.body.follower_user_uid)
          .then((res1) => {
            if (res1 === "done") {
              res.send("done");
            }
            db.query(
              `INSERT INTO notifications(notification,owner_uid,interactor_uid,date)
                  VALUES('follow',
                  '${req.body.following_user_uid}','${req.body.follower_user_uid}','${new Date()}')`
            );
          })
          .catch((err1) => {
            throw err1;
          });
      }
    })
    .catch((err) => {
      throw err;
    });
});

//get current user data
router.get("/getUserInfo", tokenVerifier, (req, res) => {
  const email = getFromHeader(req.headers, "email");

  db.query(`SELECT username,uid,profile_image_url,email,bio FROM users WHERE email='${email}'`, (err, res0) => {
    if (err) {
      throw err;
    } else {
      res.send(res0.rows[0]);
    }
  });
});

//get visited profile info
router.get("/foreignProfileInfo/:username", (req, res) => {
  const user_uid = getFromHeader(req.headers, "uid") || "09bdd5a4-4cdd-3ae1-9122-dfb66f8afc23";

  db.query(
    `SELECT username,profile_image_url,uid,
    bio,
    (SELECT COUNT(*) FROM posts WHERE owner_uid=(uid)::text)::int AS posts_count,
    '${user_uid}'=ANY(followers) AS followed_by_me,
    array_length(followers,1) as followers_count,
    array_length(following,1) as following_count
    FROM users WHERE username='${req.params.username}'`,
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

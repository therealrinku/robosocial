import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import overflowToggler from "../../utilities/overflowToggler";
import Backdrop from "./../Backdrop";
import UserListView from "./../UserListView";
import lazyLoadImage from "../../utilities/lazyLoadImage.js";
import ProfilePicPlaceholder from "../../assets/avatar.jpg";
import styles from "./Comment.module.scss";

type CommentTypes = {
  comments: any;
  comment: any;
  likeUnlikeComment: any;
  currentUserUid: string;
  currentUsername: string;
  deleteComment: any;
  getCommentLikers: any;
  gettingCommentLikers: boolean;
};

const Comment = ({
  comments,
  comment,
  likeUnlikeComment,
  currentUserUid,
  currentUsername,
  deleteComment,
  getCommentLikers,
  gettingCommentLikers,
}: CommentTypes) => {
  const [showCommentLikers, setShowCommentLikers] = useState(false);
  const commentLikers = comments.filter(
    (cmt: any) => cmt.comment_uid === comment.comment_uid
  )[0]?.likers;

  const toggleModal = (setModal: any) => {
    setModal((prev: any) => !prev);
    overflowToggler();
  };

  const loadCommentLikers = () => {
    toggleModal(setShowCommentLikers);
    if (!commentLikers) {
      getCommentLikers(comment.comment_uid);
    }
  };

  return (
    <Fragment>
      <div className={styles.Comment}>
        <img
          data-src={comment.poster_profile_image}
          src={ProfilePicPlaceholder}
          className="lazy-image"
          onLoad={lazyLoadImage}
          alt="profile-image"
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <p className={styles.Username}>
              <NavLink to={`/${comment.poster_username}`}>
                {comment.poster_username}
              </NavLink>{" "}
              {comment.comment}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "-15px",
            }}
          >
            <p>1h</p>
            <button onClick={loadCommentLikers}>
              {comment.comment_likes_count || 0}{" "}
              {comment.comment_likes_count === 1 ? "like" : "likes"}
            </button>
            <button
              onClick={() =>
                likeUnlikeComment(
                  comment.liked_by_me ? "unlike" : "like",
                  comment.comment_uid
                )
              }
            >
              {comment.liked_by_me ? "unlike" : "like"}
            </button>
            <button
              style={
                currentUserUid === comment.post_owner_uid ||
                currentUsername === comment.poster_username
                  ? { color: "red" }
                  : { display: "none" }
              }
              onClick={() => deleteComment(comment.comment_uid)}
            >
              delete
            </button>
          </div>
        </div>
      </div>

      {showCommentLikers ? (
        <Fragment>
          <UserListView
            title="Likes"
            loading={gettingCommentLikers}
            toggle={() => toggleModal(setShowCommentLikers)}
            users={commentLikers || []}
          />
          <Backdrop
            show={showCommentLikers}
            toggle={() => toggleModal(setShowCommentLikers)}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default Comment;
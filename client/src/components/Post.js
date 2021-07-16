import { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as Icons from "../Icons/CustomIcons";
import * as postsActions from "../redux/post/postsActions";
import { BiDotsHorizontal } from "react-icons/all";
import UserListModal from "./UserListModal";
import Backdrop from "./Backdrop";
import overflowToggler from "../utilities/overflowToggler";
import PostOptModal from "./PostOptModal";
import CommentBox from "./CommentBox";
import placeholderImage from "../assets/placeholder.jpg";
import lazyLoadImage from "../utilities/lazyLoadImage.js";
import ProfilePicPlaceholder from "../assets/avatar.jpg";

const Post = ({
  post_commentsCount,
  post_image,
  post_likesCount,
  post_postedDate,
  post_status,
  post_id,
  post_owner_uid,
  post_uid,
  poster_profileImage,
  poster_username,
  haveISaved,
  haveILiked,
  currentUsername,
  currentUserUid,
  currentUserProfileimage,
  LIKE_POST,
  UNLIKE_POST,
  UNSAVE_POST,
  SAVE_POST,
  GET_LIKERS,
  feedPosts,
  likersLoading,
  DELETE_POST,
  ADD_MESSAGE,
}) => {
  const thisPostLikers = feedPosts.filter((post) => post.post_uid === post_uid)[0].post_likers;
  const [showLikers, setShowLikers] = useState(false);
  const [showPostOptionsModal, setShowPostOptionsModal] = useState(false);

  const history = useHistory();

  const likeUnlikePost = () => {
    if (haveILiked) {
      UNLIKE_POST(post_uid, currentUserUid, post_owner_uid);
    } else {
      LIKE_POST(post_uid, currentUserUid, post_owner_uid);
    }
  };

  const saveUnsavePost = () => {
    if (haveISaved) {
      UNSAVE_POST(post_uid, currentUsername);
    } else {
      SAVE_POST(post_uid, currentUsername);
    }
  };

  const toggleModal = (setShowModal) => {
    overflowToggler();
    setShowModal((prev) => !prev);
  };

  const getLikers = () => {
    toggleModal(setShowLikers);
    if (!thisPostLikers) {
      GET_LIKERS(post_uid);
    }
  };

  const deletePost = () => {
    toggleModal(setShowPostOptionsModal);
    DELETE_POST(post_uid);
  };

  return (
    <Fragment>
      <div className="post--card">
        <div>
          <ul>
            <img
              data-src={poster_profileImage}
              src={ProfilePicPlaceholder}
              className="lazy-image"
              onLoad={lazyLoadImage}
              alt="post_user_image"
            />
            <Link to={`/${poster_username}`}>{poster_username}</Link>
          </ul>

          <ul>
            <button onClick={() => toggleModal(setShowPostOptionsModal)}>
              <BiDotsHorizontal />
            </button>
          </ul>
        </div>

        <div>
          <img
            className="lazy-image"
            src={placeholderImage}
            alt="post_main_img"
            data-src={post_image}
            onLoad={lazyLoadImage}
          />
        </div>

        <div>
          <div>
            <button onClick={likeUnlikePost}>{haveILiked ? <Icons.LovedIcon /> : <Icons.LoveIcon />}</button>

            <button onClick={() => history.push(`/p/${post_id}`)}>
              <Icons.CommentIcon />
            </button>

            <button>
              <Icons.ShareIcon />
            </button>
          </div>

          <div>
            <button onClick={saveUnsavePost}>{haveISaved ? <Icons.SavedIcon /> : <Icons.SaveIcon />}</button>
          </div>
        </div>

        <div>
          <p>{post_status}</p>
        </div>

        <div>
          <button onClick={getLikers}>
            {post_likesCount || "No"} {post_likesCount === 1 ? "like" : "likes"}
          </button>
          <button onClick={() => history.push(`/p/${post_id}`)}>
            {post_commentsCount} {post_commentsCount === 1 ? "comment" : "comments"}
          </button>
        </div>

        <div>
          <p>{post_postedDate}</p>
        </div>

        <section className="comment--box-pc">
          <CommentBox post_uid={post_uid} post_owner_uid={post_owner_uid} />
        </section>
      </div>

      {showLikers ? (
        <Fragment>
          <UserListModal
            title="Likes"
            loading={likersLoading}
            users={thisPostLikers || []}
            toggle={() => toggleModal(setShowLikers)}
          />
          <Backdrop show={showLikers} toggle={() => toggleModal(setShowLikers)} />
        </Fragment>
      ) : null}

      {showPostOptionsModal ? (
        <Fragment>
          <PostOptModal
            toggle={() => toggleModal(setShowPostOptionsModal)}
            isMyPost={poster_username === currentUsername}
            post_uid={post_uid}
            deletePost={deletePost}
            post_id={post_id}
            AddMessage={ADD_MESSAGE}
          />
          <Backdrop show={showPostOptionsModal} toggle={() => toggleModal(setShowPostOptionsModal)} />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    likersLoading: state.posts.loading_likers,
    feedPosts: state.posts.posts.filter((post) => post.infeed === true),
    currentUsername: state.user.currentUserData.username,
    currentUserUid: state.user.currentUserData.uid,
    currentUserProfileimage: state.user.currentUserData.profile_image_url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ADD_MESSAGE: (message) => dispatch(postsActions.ADD_MESSAGE(message)),
    DELETE_POST: (post_uid) => dispatch(postsActions.DELETE_POST(post_uid)),
    GET_LIKERS: (post_uid) => dispatch(postsActions.GET_LIKERS(post_uid)),
    SAVE_POST: (post_uid, saver_username) => dispatch(postsActions.SAVE_POST(post_uid, saver_username)),
    UNSAVE_POST: (post_uid, unsaver_username) => dispatch(postsActions.UNSAVE_POST(post_uid, unsaver_username)),
    LIKE_POST: (post_uid, liker_uid, post_owner_uid) =>
      dispatch(postsActions.LIKE_POST(post_uid, liker_uid, post_owner_uid)),
    UNLIKE_POST: (post_uid, unliker_uid) => dispatch(postsActions.UNLIKE_POST(post_uid, unliker_uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);

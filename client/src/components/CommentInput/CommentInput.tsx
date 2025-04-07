import { connect } from "react-redux";
import { useState } from "react";
import * as postsActions from "../../redux/post/postsActions";

type CommentInputTypes = {
  post_uid: string;
  post_owner_uid: string;
  ADD_COMMENT: any;
  currentUserUid: string;
  addingComment: boolean;
  currentUserProfileImage: string;
  currentUsername: string;
  toggleLoginNeededPrompt?: any;
};

const CommentInput = ({
  post_uid,
  post_owner_uid,
  ADD_COMMENT,
  currentUserUid,
  addingComment,
  currentUserProfileImage,
  currentUsername,
  toggleLoginNeededPrompt,
}: CommentInputTypes) => {
  const [comment, setComment] = useState("");

  const addComment = (e: any) => {
    e.preventDefault();

    if (currentUserUid) {
      if (comment.trim().length > 3) {
        ADD_COMMENT(
          comment,
          currentUserUid,
          post_uid,
          post_owner_uid,
          `${new Date()}`,
          currentUserProfileImage,
          currentUsername
        );
        setComment("");
      }
    } else {
      toggleLoginNeededPrompt();
      setComment("");
    }
  };

  return (
    <div className={`w-full bg-white border px-5 text-sm mb-5`}>
      <form onSubmit={addComment} className="w-full flex justify-between py-3">
        <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comment.." />
        <button className="text-[#EE323D]" disabled={comment.trim().length <= 3 || addingComment}>
          Post
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUsername: state.user.currentUserData.username,
    currentUserProfileImage: state.user.currentUserData.profile_image_url,
    currentUserUid: state.user.currentUserData.uid,
    addingComment: state.posts.adding_comment,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    ADD_COMMENT: (
      comment: string,
      commenter_uid: string,
      post_uid: string,
      post_owner_uid: string,
      posted_date: string,
      currentUserProfileImage: string,
      currentUsername: string
    ) =>
      dispatch(
        postsActions.ADD_COMMENT(
          comment,
          commenter_uid,
          post_uid,
          post_owner_uid,
          posted_date,
          currentUserProfileImage,
          currentUsername
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentInput);

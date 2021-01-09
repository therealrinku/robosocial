import postActionTypes from "./postsActionsTypes";

const initialState = {
  posts: [],
  loading_post: false,
  error: null,
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case postActionTypes.LIKE_P_POST:
      const postsCopyA = [...state.posts];
      const indexToUpdateA = postsCopyA.findIndex(
        (post) => post.post_uid === action.payload.post_uid
      );
      postsCopyA[indexToUpdateA].liked_by_me = true;
      postsCopyA[indexToUpdateA].post_likes_count =
        postsCopyA[indexToUpdateA].post_likes_count + 1;

      return {
        ...state,
        posts: postsCopyA,
      };

    case postActionTypes.UNLIKE_P_POST:
      const postsCopyB = [...state.posts];
      const indexToUpdateB = postsCopyB.findIndex(
        (post) => post.post_uid === action.payload.post_uid
      );
      postsCopyB[indexToUpdateB].liked_by_me = false;
      postsCopyB[indexToUpdateB].post_likes_count =
        postsCopyB[indexToUpdateB].post_likes_count - 1;

      return {
        ...state,
        posts: postsCopyB,
      };

    case postActionTypes.SAVE_P_POST:
      const postsCopyC = [...state.posts];
      const indexToUpdateC = postsCopyC.findIndex(
        (post) => post.post_uid === action.payload.post_uid
      );
      postsCopyC[indexToUpdateC].i_have_saved = true;

      return {
        ...state,
        posts: postsCopyC,
      };

    case postActionTypes.UNSAVE_P_POST:
      const postsCopyD = [...state.posts];
      const indexToUpdateD = postsCopyD.findIndex(
        (post) => post.post_uid === action.payload.post_uid
      );
      postsCopyD[indexToUpdateD].i_have_saved = false;

      return {
        ...state,
        posts: postsCopyD,
      };

    case postActionTypes.LOADING_POST:
      return {
        ...state,
        loading_post: true,
        error: null,
      };

    case postActionTypes.SET_POST:
      return {
        ...state,
        posts: [...state.posts, ...action.payload],
        loading_post: false,
        error: null,
      };

    case postActionTypes.ERROR_IN_POST:
      return {
        ...state,
        loading_post: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default postsReducer;
import userActionTypes from "./userActionTypes";

const intialState = {
  currentUserData: {
    uid: null,
    username: null,
    profile_image_url: null,
  },
  error: null,
  loading: false,
  recommendedUsers: [],
};

const userReducer = (state = intialState, action) => {
  switch (action.type) {
    case userActionTypes.SET_RECOMMENDED_USERS:
      return {
        ...state,
        loading: false,
        recommendedUsers: action.payload,
      };

    case userActionTypes.LOADING:
      return {
        ...state,
        loading: true,
      };

    case userActionTypes.SOMETHING_WENT_WRONG:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case userActionTypes.LOGIN:
      return {
        ...state,
        currentUserData: action.payload,
        loading: false,
        error: null,
      };

    case userActionTypes.LOGOUT:
      return {
        ...state,
        currentUserData: { uid: null, profile_image_url: null, username: null },
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;

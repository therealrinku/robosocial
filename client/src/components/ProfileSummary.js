import React, { Fragment } from "react";
import { BiDotsHorizontal, BiUserCheck } from "react-icons/all";
import { useHistory } from "react-router-dom";
import ProfilePicPlaceholder from "../assets/avatar.jpg";
import lazyLoadImage from "../utilities/lazyLoadImage";
import Linkify from "react-linkify";

const ProfileSummary = ({
  profileData,
  isMyProfile,
  toggleProfileOptions,
  toggleUnfollowPrompt,
  FOLLOW,
  LOAD_FOLLOWERS,
  LOAD_FOLLOWINGS,
}) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="profile--summary-page">
        <section>
          <img
            src={ProfilePicPlaceholder}
            data-src={profileData.profile_image_url}
            alt="profile_image"
            onLoad={lazyLoadImage}
            className="lazy-image"
          />
        </section>

        <section>
          <div>
            <p className="username">{profileData.username}</p>
            <button
              onClick={() => history.push("/edit/profile")}
              className="profile--edit-button"
              style={!isMyProfile ? { display: "none" } : null}
            >
              Edit Profile
            </button>
            <button
              className="follow--button"
              style={
                !isMyProfile && !profileData.followed_by_me
                  ? null
                  : { display: "none" }
              }
              onClick={FOLLOW}
            >
              Follow
            </button>
            <button
              className="unfollow--button"
              style={
                !isMyProfile && profileData.followed_by_me
                  ? null
                  : { display: "none" }
              }
              onClick={toggleUnfollowPrompt}
            >
              <BiUserCheck />
            </button>
            <button
              className="profile--options-button"
              onClick={toggleProfileOptions}
            >
              <BiDotsHorizontal />
            </button>
          </div>

          <div>
            <button>
              <b>{profileData.posts_count}</b> posts
            </button>
            <button onClick={LOAD_FOLLOWERS}>
              <b>{profileData.followers_count || 0}</b>{" "}
              {profileData.followers_count === 1 ? "follower" : "followers"}
            </button>
            <button onClick={LOAD_FOLLOWINGS}>
              <b>{profileData.following_count || 0}</b> following
            </button>
          </div>

          <div>
            <Linkify>
              <p className="bio">{profileData.bio}</p>
            </Linkify>
          </div>
        </section>
      </div>

      <div className="profile--summary-page-mobile">
        <section>
          <div>
            <img src={profileData.profile_image_url} alt="profile_image" />
          </div>

          <div>
            <div>
              <p className="username">{profileData.username}</p>
              <button
                className="profile--options-button"
                onClick={toggleProfileOptions}
              >
                <BiDotsHorizontal />
              </button>
            </div>

            <button
              className="profile--edit-button"
              style={!isMyProfile ? { display: "none" } : null}
              onClick={() => history.push("/edit/profile")}
            >
              Edit Profile
            </button>
            <button
              className="follow--button"
              style={
                !isMyProfile && !profileData.followed_by_me
                  ? null
                  : { display: "none" }
              }
              onClick={FOLLOW}
            >
              Follow
            </button>
            <button
              onClick={toggleUnfollowPrompt}
              className="unfollow--button"
              style={
                !isMyProfile && profileData.followed_by_me
                  ? null
                  : { display: "none" }
              }
            >
              <BiUserCheck />
            </button>
          </div>
        </section>

        <section>
          <Linkify>
            <p className="bio">{profileData.bio}</p>
          </Linkify>
        </section>

        <section>
          <button>
            <b>{profileData.posts_count}</b>
            <p>posts</p>
          </button>
          <button onClick={LOAD_FOLLOWERS}>
            <b>{profileData.followers_count || 0}</b>
            <p>
              {" "}
              {profileData.followers_count === 1 ? "follower" : "followers"}
            </p>
          </button>
          <button onClick={LOAD_FOLLOWINGS}>
            <b>{profileData.following_count || 0}</b>
            <p>following</p>
          </button>
        </section>
      </div>
    </Fragment>
  );
};

export default ProfileSummary;

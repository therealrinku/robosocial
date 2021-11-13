import { Fragment } from "react";
import { BiDotsHorizontal, BiUserCheck, FiPlus } from "react-icons/all";
import { useHistory } from "react-router-dom";
import ProfilePicPlaceholder from "../../assets/avatar.jpg";
import lazyLoadImage from "../../utilities/lazyLoadImage";
import Linkify from "react-linkify";
import styles from "./ProfileSummary.module.scss";

type ProfileSummaryTypes = {
  profileData: any;
  isMyProfile: boolean;
  toggleProfileOptions: any;
  toggleUnfollowPrompt: any;
  showPostUploadModal: any;
  FOLLOW: any;
  LOAD_FOLLOWERS: any;
  LOAD_FOLLOWINGS: any;
};

const ProfileSummary = ({
  profileData,
  isMyProfile,
  toggleProfileOptions,
  toggleUnfollowPrompt,
  showPostUploadModal,
  FOLLOW,
  LOAD_FOLLOWERS,
  LOAD_FOLLOWINGS,
}: ProfileSummaryTypes) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className={styles.ProfileSummary}>
        <img
          src={ProfilePicPlaceholder}
          data-src="https://i.picsum.photos/id/467/200/300.jpg?hmac=sQK5ibuk2pXpFclSCs5TxY7X9hsRsRbb4r5JhWqRErc"
          alt="cover-image"
          onLoad={lazyLoadImage}
          className={`lazy-image ${styles.CoverImage}`}
        />

        <section>
          <img
            src={ProfilePicPlaceholder}
            data-src={profileData.profile_image_url}
            alt="profile_image"
            onLoad={lazyLoadImage}
            className="lazy-image"
          />

          <p className={styles.username}>{profileData.username}</p>
          <p style={{ fontSize: "15px" }}>{profileData.bio}</p>

          <div className={styles.UserSummary}>
            <button>{profileData.posts_count} posts</button>
            &#183;
            <button onClick={LOAD_FOLLOWERS}>
              {profileData.followers_count || 0}{" "}
              {profileData.followers_count === 1 ? "follower" : "followers"}
            </button>
            &#183;
            <button onClick={LOAD_FOLLOWINGS}>
              {profileData.following_count || 0} following
            </button>
          </div>

          <br />

          <div className={styles.ActionButtons}>
            {isMyProfile && (
              <button
                onClick={() => history.push("/edit/profile")}
                className={styles["Profile-Edit-Button"]}
              >
                Edit Profile
              </button>
            )}

            {!isMyProfile && !profileData.followed_by_me && (
              <button className={styles.FollowButton} onClick={FOLLOW}>
                Follow
              </button>
            )}

            {!isMyProfile && profileData.followed_by_me && (
              <button
                className={styles.UnfollowButton}
                onClick={toggleUnfollowPrompt}
                style={{ fontSize: "20px" }}
              >
                <BiUserCheck />
              </button>
            )}

            {isMyProfile && (
              <button
                style={{ fontSize: "20px" }}
                onClick={showPostUploadModal}
              >
                <FiPlus />
              </button>
            )}

            <button onClick={toggleProfileOptions} style={{ fontSize: "20px" }}>
              <BiDotsHorizontal />
            </button>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default ProfileSummary;

import { Fragment, useState } from "react";
import { AiOutlinePlusSquare, AiOutlinePoweroff, AiOutlineSetting, FiClock } from "react-icons/all";
import { useHistory } from "react-router-dom";
import ProfilePicPlaceholder from "../../assets/avatar.jpg";
import lazyLoadImage from "../../utilities/lazyLoadImage";
import SettingsModal from "../SettingsModal";
import LogoutPrompt from "../LogoutPrompt";

type ProfileSummaryTypes = {
  profileData: any;
  isMyProfile: boolean;
  toggleUnfollowPrompt: any;
  showPostUploadModal: any;
  FOLLOW: any;
  LOAD_FOLLOWERS: any;
  LOAD_FOLLOWINGS: any;
  LOGOUT: () => void;
  currentUsername: string;
};

const ProfileSummary = ({
  profileData,
  isMyProfile,
  toggleUnfollowPrompt,
  showPostUploadModal,
  FOLLOW,
  LOAD_FOLLOWERS,
  LOAD_FOLLOWINGS,
  LOGOUT,
  currentUsername,
}: ProfileSummaryTypes) => {
  const history = useHistory();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  function logout() {
    history.push("/");
    localStorage.removeItem("token");
    LOGOUT();
  }

  return (
    <Fragment>
      <div className="bg-white text-sm border border-b-0">
        <section className="px-5 py-4">
          <img
            src={ProfilePicPlaceholder}
            data-src={profileData.profile_image_url ?? ProfilePicPlaceholder}
            alt="profile_image"
            onLoad={lazyLoadImage}
            className="lazy-image mb-4 h-20 w-20 md:h-36 md:w-36 object-cover"
          />

          <p className="text-lg font-bold">{profileData.username ?? "User not found"}</p>
          <p className="my-3 break-all">
            {profileData.username
              ? profileData.bio
              : "This user doesn't exist or this account might have been deleted."}
          </p>

          {profileData.username && (
            <div className="flex items-center gap-1">
              <button>
                <b>{profileData.posts_count}</b> posts
              </button>
              &#183;
              <button onClick={LOAD_FOLLOWERS}>
                <b>{profileData.followers_count || 0}</b> {profileData.followers_count === 1 ? "follower" : "followers"}
              </button>
              &#183;
              <button onClick={LOAD_FOLLOWINGS}>
                <b>{profileData.following_count || 0}</b> following
              </button>
            </div>
          )}

          {profileData.joined_date && (
            <p className="mt-3 flex items-center gap-2">
              <FiClock /> Joined on {new Date(profileData.joined_date).toDateString()}
            </p>
          )}

          <br />

          <div className="flex items-center gap-4">
            {isMyProfile && (
              <button onClick={() => setShowSettingsModal(true)}>
                <AiOutlineSetting size={20} />
              </button>
            )}

            {!isMyProfile && !profileData.followed_by_me && profileData.username && (
              <button className="text-white px-5 py-1 bg-[#018e23]" onClick={FOLLOW}>
                Follow
              </button>
            )}

            {!isMyProfile && profileData.followed_by_me && (
              <button className="text-white px-5 py-1 bg-[#EE323D]" onClick={toggleUnfollowPrompt}>
                Unfollow
              </button>
            )}

            {isMyProfile && (
              <button onClick={showPostUploadModal}>
                <AiOutlinePlusSquare size={20} />
              </button>
            )}
            {isMyProfile && currentUsername && (
              <button onClick={() => setShowLogoutPrompt(true)}>
                <AiOutlinePoweroff size={20} />
              </button>
            )}
          </div>
        </section>
      </div>

      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
      {showLogoutPrompt && <LogoutPrompt logout={logout} toggle={() => setShowLogoutPrompt(false)} />}
    </Fragment>
  );
};

export default ProfileSummary;

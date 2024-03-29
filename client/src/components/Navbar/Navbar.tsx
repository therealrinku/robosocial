import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import firestore from "../../firebase/firestore";
import Logo from "../Logo";
import { FiUser, FiX } from "react-icons/fi";
import SearchUsers from "../SearchUsers";
import lazyLoadImage from "../../utilities/lazyLoadImage.js";
import ProfilePicPlaceholder from "../../assets/avatar.jpg";
import * as userActions from "../../redux/user/userActions";
import { AiOutlineHome, AiOutlineBell, AiOutlineCompass } from "react-icons/ai";

type NavbarTypes = {
  currentUsername: string;
  currentUserUid: string;
  currentUserProfileImage: string;
  LOGOUT: Function;
};

function useOutsideAlerter(ref: any, toggle: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        toggle();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const Navbar = ({ currentUsername, currentUserUid, currentUserProfileImage, LOGOUT }: NavbarTypes) => {
  const [notificationsCount, setNotificationsCount] = useState(0);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (currentUserUid) {
      firestore
        .collection(currentUserUid)
        .doc("notifications")
        .onSnapshot((doc) => {
          const data = [];
          for (let e in doc.data()) {
            data.push(e);
          }
          setNotificationsCount(data.length);
        });
    }
  }, []);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setShowProfileOptions(false));

  return (
    <nav className="z-10 fixed top-0 left-0 w-screen flex items-center justify-center border-b h-[50px] bg-white">
      {!showSearchBox ? (
        <div className="w-[90%] md:w-[70%] flex items-center justify-between">
          <>
            <ul className="flex items-center gap-2">
              <NavLink to="/">
                <Logo />
              </NavLink>

              <NavLink to="/explore" exact activeStyle={{ color: "#018e23" }}>
                <AiOutlineCompass size={25} />
              </NavLink>
            </ul>

            <ul>
              {currentUsername && (
                <div className="flex items-center gap-6">
                  <NavLink to="/" exact activeStyle={{ color: "#018e23" }}>
                    <AiOutlineHome size={25} />
                  </NavLink>

                  <NavLink to="/notifications" exact activeStyle={{ color: "#018e23" }}>
                    <Badge badgeContent={notificationsCount} color="error" style={{ marginTop: "-4px" }}>
                      <AiOutlineBell size={25} />
                    </Badge>
                  </NavLink>

                  <NavLink to={`/user/${currentUsername}`} exact activeStyle={{ color: "#018e23" }}>
                    <img
                      data-src={currentUserProfileImage}
                      src={ProfilePicPlaceholder}
                      className={`lazy-image h-[25px] w-[25px] rounded-full object-cover`}
                      onLoad={lazyLoadImage}
                      alt="profile image"
                    />
                  </NavLink>

                  {/* <div ref={wrapperRef} className="relative mt-1">
                    <button onClick={() => setShowProfileOptions((prev) => !prev)}>
                      <img
                        data-src={currentUserProfileImage}
                        src={ProfilePicPlaceholder}
                        className={`lazy-image h-6 w-6 rounded-full`}
                        onLoad={lazyLoadImage}
                        alt="profile image"
                      />
                    </button>

                    {showProfileOptions && (
                      <ProfileOptionsModal
                        toggle={() => setShowProfileOptions(false)}
                        LOGOUT={Logout}
                        currentUsername={currentUsername}
                      />
                    )}
                  </div> */}
                </div>
              )}

              {!currentUsername && (
                <NavLink to="/" exact>
                  <FiUser size={25} />
                </NavLink>
              )}
            </ul>
          </>
        </div>
      ) : (
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "300px",
          }}
        >
          <SearchUsers closeFunc={() => setShowSearchBox(false)} />
          <button onClick={() => setShowSearchBox(false)}>
            <FiX />
          </button>
        </section>
      )}
    </nav>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentUserUid: state.user.currentUserData.uid,
    currentUsername: state.user.currentUserData.username,
    currentUserProfileImage: state.user.currentUserData.profile_image_url,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    LOGOUT: () => dispatch(userActions.LOGOUT()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);

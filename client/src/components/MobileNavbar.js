import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Icons from "../Icons/CustomIcons";
import { connect } from "react-redux";
import toggleOverflow from "../utilities/overflowToggler";
import AddPost from "./AddPostModal";
import overflowToggler from "../utilities/overflowToggler";
import Activity from "./Activity";
import Backdrop from "./Backdrop";
import Badge from "@material-ui/core/Badge";
import firestore from "../firebase/firestore";

const MobileNavbar = ({
  currentUsername,
  currentUserProfileimage,
  currentUserUid,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const history = useHistory();
  const pathname = history.location.pathname;

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

  const toggleActivity = () => {
    overflowToggler();
    setShowActivity((prev) => !prev);
  };

  const toggleAddPostModal = () => {
    toggleOverflow();
    setShowAddPost((prev) => !prev);
  };

  const updateFile = (e) => {
    if (e.target.files[0]) {
      toggleAddPostModal();
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <Fragment>
      <div
        className="navbar--mobile"
        style={!currentUsername ? { display: "none" } : null}
      >
        {showAddPost ? (
          <AddPost selectedImage={selectedImage} toggle={toggleAddPostModal} />
        ) : null}

        <Link to="/">
          {pathname === "/" ? <Icons.HomeActiveIcon /> : <Icons.HomeIcon />}
        </Link>

        <Link to="/explore">
          {pathname === "/explore" ? (
            <Icons.ExploreActiveIconMobile />
          ) : (
            <Icons.SearchIcon />
          )}
        </Link>

        <div>
          <input
            type="file"
            id="file_input"
            onChange={updateFile}
            name="post"
          />
          <label htmlFor="file_input">
            <Icons.NewPostIcon />
          </label>
        </div>

        <button onClick={toggleActivity}>
          <Badge badgeContent={notificationsCount} color="error">
            <Icons.ActivityIcon />
          </Badge>
        </button>

        <Link to={`/${currentUsername}`}>
          <img
            src={currentUserProfileimage || "https://bit.ly/3pc96tw"}
            style={
              pathname === `/${currentUsername}`
                ? {
                    border: "solid 1px black",
                    padding: "2px",
                    width: "20px",
                    height: "20px",
                  }
                : null
            }
            alt="profile_image"
          />
        </Link>
      </div>

      {showActivity ? (
        <Fragment>
          <Backdrop show={showActivity} toggle={toggleActivity} />
          <Activity
            currentUserUid={currentUserUid}
            toggle={toggleActivity}
            clear={() => setNotificationsCount(0)}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUserUid: state.user.currentUserData.uid,
    currentUsername: state.user.currentUserData.username,
    currentUserProfileimage: state.user.currentUserData.profile_image_url,
  };
};

export default connect(mapStateToProps)(MobileNavbar);

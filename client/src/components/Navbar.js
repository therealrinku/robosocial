import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as Icons from "../Icons/CustomIcons";
import SearchView from "./SearchView";
import { useHistory } from "react-router-dom";
import Activity from "./Activity";
import Backdrop from "./Backdrop";
import OverflowToggler from "../utilities/overflowToggler";
import Badge from "@material-ui/core/Badge";
import firestore from "../firebase/firestore";
import ProfilePicPlaceholder from "../assets/avatar.jpg";
import lazyLoadImage from "../utilities/lazyLoadImage";

const Navbar = ({
  currentUsername,
  currentUserProfileimage,
  currentUserUid,
  showSearchBarOnly,
}) => {
  const history = useHistory();
  const pathname = history.location.pathname;
  const [showActivity, setShowActivity] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

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
    OverflowToggler();
    setShowActivity((prev) => !prev);
  };

  return (
    <Fragment>
      <div className="navbar">
        <ul style={showSearchBarOnly ? { display: "none" } : null}>
          <Link to="/">Instaclone</Link>
        </ul>

        <ul
          style={
            showSearchBarOnly
              ? {
                  display: "block",
                  width: "75%",
                }
              : null
          }
        >
          <SearchView width={showSearchBarOnly ? "100%" : null} />
        </ul>

        <ul style={currentUsername ? { display: "none" } : null}>
          <button className="login--btn" onClick={() => history.push("/login")}>
            Login
          </button>
          <button
            className="signup--btn"
            onClick={() => history.push("/signup")}
          >
            Signup
          </button>
        </ul>

        <ul
          className="right"
          style={!currentUsername ? { display: "none" } : null}
        >
          <Link to="/">
            {pathname === "/" ? <Icons.HomeActiveIcon /> : <Icons.HomeIcon />}
          </Link>

          <Link to="/chat">
            <Icons.ChatIcon />
          </Link>

          <Link to="/explore">
            {pathname === "/explore" ? (
              <Icons.ExploreActiveIcon />
            ) : (
              <Icons.ExploreIcon />
            )}
          </Link>

          <button onClick={toggleActivity} className="activity--btn">
            <Badge
              badgeContent={notificationsCount}
              color="error"
              style={{ marginTop: "-8px" }}
            >
              <Icons.ActivityIcon />
            </Badge>
          </button>

          <Link to={`/${currentUsername}`}>
            <img
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
              src={ProfilePicPlaceholder}
              data-src={currentUserProfileimage}
              alt="profile_image"
              className="lazy-image"
              onLoad={lazyLoadImage}
            />
          </Link>
        </ul>
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

export default connect(mapStateToProps)(Navbar);

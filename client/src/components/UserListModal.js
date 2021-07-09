import React from "react";
import { VscClose } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

const UserListModal = ({ title, loading, toggle, users }) => {
  return (
    <div className="view--users-modal">
      <p className="title">{title}</p>
      {users.length > 0 ? (
        users.map((user) => {
          return (
            <div key={new Date() * Math.random()} className="user">
              <img src={user.profile_image_url} alt="profile_img" className="user-image" />
              <NavLink to={`/${user.username}`} onClick={toggle}>
                {user.username}
              </NavLink>
            </div>
          );
        })
      ) : (
        <p>No any {title} atm.</p>
      )}
    </div>
  );
};

export default UserListModal;

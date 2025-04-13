import React from "react";
import "./NavBar.scss";
import logo from "../../assets/logo/Logo1.png";
const NavBar = () => {
  return (
    <div className="nav__bar">
      <div className="left">
        <img className="logo__img" src={logo} alt="" />
        <input type="text" placeholder="Search" />
      </div>
      <nav>
        <ul>
          <li>Write</li>
          <li>Notifications</li>
          <li>Profile</li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;

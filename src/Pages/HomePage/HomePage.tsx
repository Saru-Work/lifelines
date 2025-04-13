import React from "react";
import "./HomePage.scss";
import logo from "../../assets/logo/Logo1.png";
import heroImg from "../../assets/pictures/hero.png";
import writeIcon from "../../assets/icons/write.svg";
import { useSelector, useDispatch } from "react-redux";
import { changeState } from "../../state/loginSlice";
import { RootState } from "../../state/store";
import LoginForm from "../../components/LoginForm/LoginForm";
const HomePage = () => {
  const dispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login.isOpen);
  return (
    <div className="home__page">
      <div className="nav__bar">
        <div className="left">
          <img className="logo__img" src={logo} alt="" />
        </div>
        <nav>
          <ul>
            <li>
              <img className="write__icon" src={writeIcon} />
            </li>
            <li>Sign In</li>
            <li>{loginState ? "saru" : "hasan"}</li>
            <li>
              <button
                onClick={() => {
                  dispatch(changeState(loginState));
                }}
              >
                Get Started
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hero">
        <div className="right">
          <h1>Stories that </h1>
          <h1>Matter,</h1>
          <h1>Ideas that shine</h1>
          <p>Read stories, write your own, and explore new ideas.</p>
          <button>Explore</button>
        </div>
        <div className="left">
          <img src={heroImg} alt="" />
        </div>
      </div>
      <LoginForm />
    </div>
  );
};

export default HomePage;

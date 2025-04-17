import React, { useState } from "react";
import "./LandingPage.scss";
import logo from "../../assets/logo/LIfeLines.png";
import heroImg from "../../assets/pictures/hero.png";
import writeIcon from "../../assets/icons/write.svg";
import { useSelector, useDispatch } from "react-redux";
import { changeState } from "../../state/loginSlice";
import { RootState } from "../../state/store";
import LoginForm from "../../components/LoginForm/LoginForm";
const LandingPage = () => {
  const [whatsClicked, setWhatsClicked] = useState<null | string>(null);
  const dispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login.isOpen);
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="home__page">
      <div className="nav__bar">
        <div className="left">
          <img className="logo__img" src={logo} alt="" />
        </div>
        <nav>
          <ul>
            <li>
              <img
                onClick={() => {
                  dispatch(changeState(loginState));
                  setWhatsClicked("Join to start writing.");
                }}
                className="write__icon"
                src={writeIcon}
              />
            </li>
            <li
              onClick={() => {
                dispatch(changeState(loginState));
                setIsLogin(true);
                setWhatsClicked("Welcome back.");
              }}
            >
              Sign In
            </li>
            <li>
              <button
                onClick={() => {
                  dispatch(changeState(loginState));
                  setIsLogin(false);
                  setWhatsClicked("Join LifeLines.");
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
          <button
            onClick={() => {
              dispatch(changeState(loginState));
              setWhatsClicked("Join to explore.");
            }}
          >
            Explore
          </button>
        </div>
        <div className="left">
          <img src={heroImg} alt="" />
        </div>
      </div>
      {/* {loginState && <LoginForm />} */}
      <LoginForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        whatsClicked={whatsClicked}
      />
    </div>
  );
};

export default LandingPage;

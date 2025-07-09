import { useState } from "react";
import "./LandingPage.scss";
import logo from "../../assets/logo/LIfeLines.png";
import heroImg from "../../assets/pictures/hero.png";
import writeIcon from "../../assets/icons/write.svg";
import { useSelector, useDispatch } from "react-redux";
import { changeState } from "../../state/loginSlice";
import { RootState } from "../../state/store";
import LoginForm from "../../components/LoginForm/LoginForm";
import LoadingBar from "../../components/LoadingBar/LoadingBar";

const LandingPage = () => {
  const [whatsClicked, setWhatsClicked] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login.isOpen);

  const openModal = (message: string, loginMode: boolean) => {
    dispatch(changeState(loginState));
    setWhatsClicked(message);
    setIsLogin(loginMode);
  };

  return (
    <div className="home__page">
      <LoadingBar loading={loading} />

      <header className="nav__bar">
        <div className="left">
          <img className="logo__img" src={logo} alt="LifeLines Logo" />
        </div>
        <nav>
          <ul>
            <li>
              <img
                src={writeIcon}
                className="write__icon"
                alt="Write Icon"
                onClick={() => openModal("Join to start writing.", false)}
              />
            </li>
            <li
              className="sign__in__btn"
              onClick={() => openModal("Welcome back.", true)}
            >
              Sign In
            </li>
            <li>
              <button onClick={() => openModal("Join LifeLines.", false)}>
                Get Started
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <div className="right">
          <h1>Stories that</h1>
          <h1>Matter,</h1>
          <h1>Ideas that shine</h1>
          <h1 className="whole">Stories that Matter, Ideas that shine</h1>
          <p>Read stories, write your own, and explore new ideas.</p>
          <button onClick={() => openModal("Join to explore.", false)}>
            Explore
          </button>
        </div>
        <div className="left">
          <img src={heroImg} alt="Hero" />
        </div>
      </section>

      <LoginForm
        setLoading={setLoading}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        whatsClicked={whatsClicked}
      />
    </div>
  );
};

export default LandingPage;

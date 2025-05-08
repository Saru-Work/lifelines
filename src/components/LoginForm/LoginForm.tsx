import { useEffect, useRef, useState } from "react";
import GoogleImg from "../../assets/icons/google.svg";
import "./LoginForm.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { changeState } from "../../state/loginSlice";
import { validateEmail, validatePassword } from "../../utils/authValidate";
import { auth, db } from "../../config/firebase";
import { addUser } from "../../state/userSlice";
import { collection, addDoc } from "firebase/firestore";
import showIcon from "../../assets/icons/view.png";
import hideIcon from "../../assets/icons/hide.png";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
interface props {
  whatsClicked: string | null;
  isLogin: boolean;
  setIsLogin: (state: boolean) => void;
  setLoading: (state: boolean) => void;
}

const registerUser = async (uid: string, email: string | null) => {
  const userData = {
    photoURL: "",
    name: "LifeLines user",
    email: email,
    uid: uid,
    bio: "",
    blogs: [],
  };
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const LoginForm = ({
  whatsClicked,
  isLogin,
  setIsLogin,
  setLoading,
}: props) => {
  const navigate = useNavigate();
  const [isShowing, setIsShowing] = useState({
    password: false,
    cPassword: false,
  });
  const formContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login.isOpen);
  const [submited, setSubmited] = useState(false);

  const checkConfirmPassword = () => {
    return userCredentials.password != userCredentials.confirmPassword;
  };
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  const signInUser = () => {
    try {
      signInWithEmailAndPassword(
        auth,
        userCredentials.email,
        userCredentials.password
      )
        .then((user) => {
          dispatch(
            addUser({
              email: user.user.email,
              uid: user.user.uid,
              displayName: user.user.displayName,
              photoURL: user.user.photoURL,
            })
          );
          dispatch(changeState(loginState));
          navigate("/feed");
          console.log(user.user);
        })
        .catch((err) => {
          console.log(err.message);
          const newError = {
            ...errors,
            emailError: "",
            passwordError: "Password and Email didn't match!",
          };
          setErrors(newError);
          setSubmited(false);
        });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const createUser = () => {
    createUserWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    )
      .then((user) => {
        dispatch(addUser({ email: user.user.email, uid: user.user.uid }));
        dispatch(changeState(loginState));
        registerUser(user.user.uid, user.user.email);
        navigate("/feed");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  useEffect(() => {
    if (!loginState) {
      setErrors({ ...errors, passwordError: "", emailError: "" });
      setIsShowing({ cPassword: false, password: false });
    }
  }, [loginState]);
  return (
    <div
      ref={formContainerRef}
      className={`login__form ${loginState ? " show" : null}`}
      onClick={(e) => {
        if (e.target != formContainerRef.current) return;
        dispatch(changeState(loginState));
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmited(true);
          setLoading(true);
          const newErrors = {
            emailError: "",
            passwordError: "",
            confirmPasswordError: "",
          };
          if (!validatePassword(userCredentials.password)) {
            newErrors.passwordError = "Not a valid password";
            setSubmited(false);
          }

          if (!validateEmail(userCredentials.email)) {
            newErrors.emailError = "Not a valid email";
            setSubmited(false);
          }
          console.log(newErrors);
          setErrors(newErrors);
          if (!isLogin) {
            if (checkConfirmPassword()) {
              newErrors.confirmPasswordError = "Passwords didn't match";
              setSubmited(false);
            }
            setErrors(newErrors);
            if (
              newErrors.emailError == "" &&
              newErrors.passwordError == "" &&
              newErrors.confirmPasswordError == ""
            ) {
              createUser();
            }
          } else {
            if (newErrors.emailError == "" && newErrors.passwordError == "") {
              signInUser();
            }
          }
        }}
        action=""
      >
        <h1>{whatsClicked}</h1>
        <div className="input__section email__section">
          <input
            onChange={(e) => {
              setUserCredentials({ ...userCredentials, email: e.target.value });
            }}
            type="text"
            placeholder="Email"
            name="email"
          />
          <p className="email__error error">{errors.emailError}</p>
        </div>
        <div className="input__section password__section">
          <input
            onChange={(e) => {
              setUserCredentials({
                ...userCredentials,
                password: e.target.value,
              });
            }}
            type={isShowing.password ? "text" : "password"}
            placeholder="Password"
          />
          <p className="password__error error">{errors.passwordError}</p>
          <button
            type="button"
            onClick={() => {
              setIsShowing({ ...isShowing, password: !isShowing.password });
            }}
            className="show__password__btn"
          >
            {isShowing.password ? (
              <img className="eye__icon" src={hideIcon} />
            ) : (
              <img className="eye__icon" src={showIcon} />
            )}
          </button>
        </div>
        {!isLogin && (
          <div className="input__section confirm__password__section">
            <input
              onChange={(e) => {
                setUserCredentials({
                  ...userCredentials,
                  confirmPassword: e.target.value,
                });
              }}
              type={isShowing.cPassword ? "text" : "password"}
              placeholder="Confirm password"
            />
            <p className="error confirm__password__error">
              {errors.confirmPasswordError}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsShowing({ ...isShowing, cPassword: !isShowing.cPassword });
              }}
              className="show__password__btn"
            >
              {isShowing.cPassword ? (
                <img className="eye__icon" src={hideIcon} />
              ) : (
                <img className="eye__icon" src={showIcon} />
              )}
            </button>
          </div>
        )}
        {isLogin ? (
          <div className="google__auth">
            {" "}
            <img src={GoogleImg} />
            Sign In with Google
          </div>
        ) : (
          <div className="google__auth">
            <img src={GoogleImg} />
            Sign Up with Google
          </div>
        )}
        {isLogin ? (
          <button type="submit" className="sign__btn">
            <div className={`loader ${submited ? " spinning" : null}`}></div>
            <div>Sign In</div>
          </button>
        ) : (
          <button type="submit" className="sign__btn">
            <div className={`loader ${submited ? " spinning" : null}`}></div>
            <div>Sign Up</div>
          </button>
        )}
        {isLogin ? (
          <p>
            No account?{" "}
            <span
              onClick={() => {
                setIsLogin(false);
              }}
            >
              Create one
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => {
                setIsLogin(true);
              }}
            >
              Sign in
            </span>
          </p>
        )}
        <button
          onClick={() => {
            dispatch(changeState(loginState));
          }}
          type="button"
          className="close__btn"
        >
          x
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

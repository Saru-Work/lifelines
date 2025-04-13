import React, { useReducer, useRef, useState } from "react";
import "./LoginForm.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { changeState } from "../../state/loginSlice";
const LoginForm = () => {
  const formContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login.isOpen);
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div
      ref={formContainerRef}
      className="login__form"
      onClick={(e) => {
        if (e.target != formContainerRef.current) return;
        dispatch(changeState(loginState));
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        action=""
      >
        <h1>Welcome</h1>
        <div className="input__section email__section">
          <label htmlFor="">Email</label>
          <input type="text" name="email" />
        </div>
        <div className="input__section password__section">
          <label htmlFor="">Password</label>
          <input type="password" />
        </div>
        {!isLogin && (
          <div className="input__section confirm__password__section">
            <label htmlFor="">Confirm Password</label>
            <input type="password" />
          </div>
        )}
        {isLogin ? <button>Sign In</button> : <button>Sign Up</button>}
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
      </form>
    </div>
  );
};

export default LoginForm;

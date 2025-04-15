import { useEffect, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./Pages/HomePage/HomePage";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Profile from "./Pages/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "./state/store";

function App() {
  const userState = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (userState.email == "" && userState.uid == "") {
      navigate("/");
    }
  }, [userState]);
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<Profile />} path="me" />
    </Routes>
  );
}

export default App;

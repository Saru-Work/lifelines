import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Profile from "./Pages/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "./state/store";
import { useDispatch } from "react-redux";
import { addUser } from "./state/userSlice";
import Write from "./Pages/Write/Write";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Feed from "./Pages/Feed/Feed";
import AuthorPage from "./Pages/AuthorPage/AuthorPage";
import StoryPage from "./Pages/StoryPage/StoryPage";

function App() {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(
          addUser({
            uid: "",
            email: "",
            displayName: "",
            photoURL: "",
          })
        );
      }
    });
    return () => unsubscribe();
  }, []);
  return userState ? (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<Feed />} path="/feed" />
      <Route element={<Profile />} path="/me" />
      <Route element={<Write />} path="/write" />
      <Route element={<AuthorPage />} path="/author/:authorId" />
      <Route element={<StoryPage />} path="/story/:storyId" />
    </Routes>
  ) : (
    <div>Loading</div>
  );
}

export default App;

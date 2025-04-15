import LandingPage from "../LandingPage/LandingPage";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Feed from "../Feed/Feed";
const HomePage = () => {
  const userState = useSelector((state: RootState) => state.user);
  return (
    <>
      {userState.email == "" && userState.uid == "" ? (
        <LandingPage />
      ) : (
        <Feed />
      )}
    </>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { collection, getDoc } from "firebase/firestore";
import "./Profile.scss";
import EditForm from "../../components/EditForm/EditForm";
import { auth } from "../../config/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log(userState);
  }, []);
  return (
    <div className="profile">
      <NavBar />
      <section className="content">
        <div className="left">
          <h1 className="name">{userState?.displayName}</h1>
          <div>
            <h2>Your Stories</h2>
          </div>
        </div>
        <div className="right">
          <p
            onClick={() => {
              setIsOpen(true);
            }}
            className="edit__btn"
          >
            Edit Profile
          </p>
        </div>
      </section>
      <EditForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Profile;

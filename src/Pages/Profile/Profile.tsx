import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { getDocs, collection, where, query } from "firebase/firestore";
import "./Profile.scss";
import EditForm from "../../components/EditForm/EditForm";
import { auth, db } from "../../config/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
interface story {
  docId: string;
  title: string;
  story: string;
  uid: string;
  createdAt: string;
  likes: number;
  comments: string;
}
const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [myStories, setMyStories] = useState<story[] | null>([]);
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const getMyStories = async () => {
      const storiesRef = collection(db, "stories");
      const q = query(storiesRef, where("uid", "==", userState.uid));
      const querySnapshot = await getDocs(q);
      const newData: any = [];
      querySnapshot.forEach((doc) => {
        newData.push({ ...doc.data(), docId: doc.id });
      });
      setMyStories(newData);
    };

    getMyStories();
  }, []);
  return (
    <div className="profile">
      <NavBar />
      <section className="content">
        <div className="left">
          <h1 className="name">{userState?.displayName}</h1>
          <div>
            <h2>Your Stories</h2>
            <ul>
              {myStories?.map((story) => {
                return (
                  <li>
                    <h3>{story.title}</h3>
                    <p>{story.story}</p>
                  </li>
                );
              })}
            </ul>
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

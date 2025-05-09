import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import {
  getDocs,
  collection,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Profile.scss";
import EditForm from "../../components/EditForm/EditForm";
import { auth, db } from "../../config/firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import userIcon from "../../assets/icons/user.png";
import Story from "../../components/Story/Story";
import Shimmer from "../../components/Shimmer/Shimmer";
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
  const deleteStory = async (storyId: string) => {
    try {
      await deleteDoc(doc(db, "stories", storyId));
      getMyStories();
    } catch (error) {
      console.log("fail");
    }
  };
  const list: { name: string; handleClick: (state: string) => void }[] = [
    { name: "Delete", handleClick: deleteStory },
    { name: "Update", handleClick: () => {} },
  ];
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
  useEffect(() => {
    getMyStories();
  }, [userState]);
  return (
    <div className="profile">
      <NavBar filterStories={() => {}} />
      <section className="content">
        <div className="left">
          <h1 className="name">{userState.displayName}</h1>
          <div className="my__stories">
            {myStories && myStories.length != 0 ? (
              <ul>
                {myStories.map((story, i) => {
                  return (
                    <li className="story__li" key={i}>
                      <Story isProfile={true} story={story} list={list} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              new Array(10).fill(null).map((_, i) => {
                return (
                  <li
                    style={{
                      listStyle: "none",
                    }}
                    key={i}
                  >
                    <Shimmer />
                  </li>
                );
              })
            )}
          </div>
        </div>
        <div className="right">
          <img
            className="profile__image"
            src={userState.photoURL || userIcon}
          />
          <p className="name">{userState.displayName}</p>
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
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        type="button"
        className="edit__button"
      >
        Edit Profile
      </button>
      <EditForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Profile;

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  getDocs,
  collection,
  where,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import NavBar from "../../components/NavBar/NavBar";
import EditForm from "../../components/EditForm/EditForm";
import Story from "../../components/Story/Story";
import Shimmer from "../../components/Shimmer/Shimmer";
import userIcon from "../../assets/icons/user.png";
import { auth, db } from "../../config/firebase";
import { RootState } from "../../state/store";
import "./Profile.scss";

interface StoryType {
  docId: string;
  title: string;
  story: string;
  uid: string;
  createdAt: string;
  likes: number;
  comments: number;
  name?: string;
  photoUrl?: string;
  userId?: string;
}

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [myStories, setMyStories] = useState<StoryType[]>([]);
  const userState = useSelector((state: RootState) => state.user);

  const getUserStoryMeta = async (uid: string, storyId: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const userSnap = await getDocs(q);

    const likesRef = collection(db, "stories", storyId, "likes");
    const commentsRef = collection(db, "stories", storyId, "comments");

    const [likesSnap, commentsSnap] = await Promise.all([
      getDocs(query(likesRef, where("liked", "==", true))),
      getDocs(commentsRef),
    ]);

    const userDoc = userSnap.docs[0];
    const user = userDoc?.data();

    return {
      name: user?.name || "Unknown",
      photoUrl: user?.photoURL || "",
      userId: userDoc?.id || "",
      likes: likesSnap.size,
      comments: commentsSnap.size,
    };
  };

  const getMyStories = useCallback(async () => {
    if (!userState.uid) return;

    const storiesRef = collection(db, "stories");
    const q = query(storiesRef, where("uid", "==", userState.uid));
    const storySnap = await getDocs(q);

    const storyData = await Promise.allSettled(
      storySnap.docs.map(async (docSnap) => {
        const story = docSnap.data();
        const meta = await getUserStoryMeta(story.uid, docSnap.id);
        return {
          ...meta,
          ...story,
          docId: docSnap.id,
        };
      })
    );

    const successfulStories = storyData
      .filter((res) => res.status === "fulfilled")
      .map((res: any) => res.value);

    setMyStories(successfulStories);
  }, [userState.uid]);

  const deleteStory = async (storyId: string) => {
    try {
      await deleteDoc(doc(db, "stories", storyId));
      await getMyStories();
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const storyActions = [
    { name: "Delete", handleClick: deleteStory },
    { name: "Update", handleClick: () => {} },
  ];

  useEffect(() => {
    getMyStories();
  }, [getMyStories]);

  return (
    <div className="profile">
      <NavBar filterStories={() => {}} />
      <section className="content">
        <div className="left">
          <h1 className="name">{userState.displayName || "Guest"}</h1>
          <div className="my__stories">
            {myStories.length > 0 ? (
              <ul>
                {myStories.map((story, i) => (
                  <li className="story__li" key={story.docId}>
                    <Story
                      isProfile={true}
                      storyDoc={story}
                      list={storyActions}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {new Array(5).fill(null).map((_, i) => (
                  <li style={{ listStyle: "none" }} key={i}>
                    <Shimmer />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="right">
          <img
            className="profile__image"
            src={userState.photoURL || userIcon}
            alt="User Avatar"
          />
          <p className="name">{userState.displayName}</p>
          <p className="edit__btn" onClick={() => setIsOpen(true)}>
            Edit Profile
          </p>
        </div>
      </section>
      <button
        className="edit__button"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Edit Profile
      </button>
      <EditForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Profile;

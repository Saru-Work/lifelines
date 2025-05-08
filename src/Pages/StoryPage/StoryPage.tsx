import { useEffect, useState } from "react";
import "./StoryPage.scss";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Link, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
const StoryPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState<any>();
  const [likeClicked, setLikedClicked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [userData, setUserData] = useState<any>();
  const userState = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const getLikeStatus = async () => {
    if (!storyId) return;
    const storyRef = doc(db, "stories", storyId);
    const likesCollectionRef = collection(storyRef, "likes");
    const likedQuery = query(likesCollectionRef, where("liked", "==", true));
    const likedDocs = await getDocs(likedQuery);
    setLikes(likedDocs.size);
    const likedRef = doc(likesCollectionRef, userState.uid);
    const likedDoc = await getDoc(likedRef);

    if (likedDoc.exists()) {
      const data = likedDoc.data();
      if (data.liked === true) {
        setLikedClicked(true);
        console.log("Liked!");
      } else {
        data.liked = false;
        console.log("Uniked!");
      }
    } else {
      setLikedClicked(false);
      console.log("Not liked!");
    }
  };

  useEffect(() => {
    getLikeStatus();
  }, []);

  useEffect(() => {
    const getUser = async (userId: string) => {
      if (!userId) return;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
      setLoading(false);
      querySnapshot.forEach((i) => {
        setUserData({ ...i.data(), uid: i.id });
      });
    };
    const getStory = async () => {
      if (!storyId) return;
      const storyRef = doc(db, "stories", storyId);
      const authSnap = await getDoc(storyRef);
      if (authSnap.exists()) {
        setStory(authSnap.data());
        getUser(authSnap.data().uid);
        console.log(authSnap.data());
      } else {
        console.log("Error");
      }
    };
    getStory();
  }, []);
  const likeStory = async () => {
    if (!storyId) return;
    setLikes((prev) => prev + 1);
    const storyRef = doc(db, "stories", storyId);
    const likedRef = doc(collection(storyRef, "likes"), userState.uid);
    await setDoc(likedRef, {
      liked: true,
      likedAt: Timestamp.now(),
    });
    getLikeStatus();
  };

  const unlikeStory = async () => {
    if (!storyId) return;
    setLikes((prev) => prev - 1);
    const storyRef = doc(db, "stories", storyId);
    const likedRef = doc(collection(storyRef, "likes"), userState.uid);
    await setDoc(likedRef, {
      liked: false,
      likedAt: Timestamp.now(),
    });
    getLikeStatus();
  };
  return (
    <div className="story__page">
      <LoadingBar loading={loading} />
      <NavBar filterStories={() => {}} />
      {story && userData ? (
        <div className="hero">
          <div className="story__profile__container">
            <Link className="link" to={"/author/" + userData.uid}>
              <div className="nameandphoto">
                <img
                  className="story__author__picture"
                  src={userData.photoURL}
                  alt=""
                />
                <p
                  style={{
                    textDecoration: "none",
                  }}
                  className="story__author__name"
                >
                  {userData.name}
                </p>
              </div>
            </Link>
          </div>
          <div className="story__container">
            <h1 className="title">{story.title}</h1>
            <div className="story">{story.story}</div>
            <div className="buttons">
              <div className="like__btn__container">
                <div
                  onClick={() => {
                    setLikedClicked((prev) => !prev);
                    if (likeClicked) {
                      unlikeStory();
                    } else {
                      likeStory();
                    }
                  }}
                  className={`like__btn ${likeClicked && " clicked"}`}
                ></div>
                <p>{likes}</p>
              </div>
              <div className="comment__btn"></div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default StoryPage;

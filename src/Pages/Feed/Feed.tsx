import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./Feed.scss";
import likeIcon from "../../assets/icons/heart.png";
import commentIcon from "../../assets/icons/comments.png";
interface story {
  authorName: string;
  docId: string;
  title: string;
  story: string;
  uid: string;
  createdAt: string;
  likes: number;
  comments: string;
}
const Feed = () => {
  const [stories, setStories] = useState<story[] | []>([]);
  const getName = async (uid: string) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const user: any = [];
    querySnapshot.forEach((doc) => {
      user.push(doc.data());
    });
    return user[0].name;
  };
  useEffect(() => {
    const getStories = async () => {
      const querySnapshot = await getDocs(collection(db, "stories"));
      const data: any = [];

      querySnapshot.forEach((doc) => {
        data.push({
          ...doc.data(),
          docId: doc.id,
          authorName: getName(doc.data().uid),
        });
      });
      setStories(data);
    };
    getStories();
  }, []);

  return (
    <div className="feed">
      <NavBar />
      {stories.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <div className="stories">
          <ul>
            {stories.map((story) => {
              return (
                <li key={story.docId}>
                  <p>{story.authorName}</p>
                  <h2 className="story__title">{story.title}</h2>
                  <p className="story__content">{story.story}</p>
                  <div className="action__btn__container">
                    <div className="like__container">
                      <img
                        className="like__icon action__btn"
                        src={likeIcon}
                        alt="Like Icon"
                      />
                      <span>Likes</span>
                    </div>
                    <div className="comment__container">
                      <img
                        className="like__icon action__btn"
                        src={commentIcon}
                        alt="Like Icon"
                      />
                      <span>Comments</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Feed;

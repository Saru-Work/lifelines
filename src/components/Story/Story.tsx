import { useEffect, useState } from "react";
import userIcon from "../../assets/icons/user.png";
import "./Story.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Link } from "react-router-dom";
import DropDown from "../DropDown/DropDown";
const Story = ({
  story,
  isProfile,
  list,
}: {
  story: any;
  isProfile: boolean;
  list: any;
}) => {
  const [data, setData] = useState<{
    name?: string;
    photoUrl?: any;
    userId?: string;
    likes?: number;
    comments?: number;
  }>({});
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  useEffect(() => {
    const getData = async (uid: string) => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const likesCollectionRef = collection(
        db,
        "stories",
        story.docId,
        "likes"
      );
      const commentCollectionRef = collection(
        db,
        "stories",
        story.docId,
        "comments"
      );
      const commentSnap = await getDocs(commentCollectionRef);
      const likedQuery = query(likesCollectionRef, where("liked", "==", true));
      const subSnap = await getDocs(likedQuery);
      const user: any = [];
      let id = "";
      querySnapshot.forEach((doc) => {
        user.push(doc.data());
        id = doc.id;
      });
      setData({
        name: user[0].name,
        photoUrl: user[0].photoURL,
        userId: id,
        likes: subSnap.size,
        comments: commentSnap.size,
      });
    };

    getData(story.uid);
  }, []);
  return (
    <div className="story">
      {!isProfile && (
        <Link className="user__navigation" to={"/author/" + data.userId || ""}>
          <div className="profile__container">
            <img
              className="author__profile__img"
              src={data.photoUrl || userIcon}
            />
            <p className="author__name">{data.name}</p>
          </div>
        </Link>
      )}
      <Link className="story__navigation" to={"/story/" + story.docId}>
        <h2 className="story__title">{story.title}</h2>
        <p className="story__content">{story.story}</p>
      </Link>
      <div className="action__btn__container">
        <div className="landc">
          <div className="like__container">
            <span>❤️</span>
            <span>{data.likes}</span>
          </div>
          <div className="comment__container">
            <span>💬</span>
            <span>{data.comments}</span>
          </div>
        </div>
        <div className="options">
          <div
            onClick={() => {
              setIsDropDownOpen((prev) => !prev);
            }}
          >
            ⋯
          </div>
          <div>
            {isDropDownOpen && (
              <DropDown
                storyId={story.docId}
                list={list}
                setIsDropDownOpen={setIsDropDownOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;

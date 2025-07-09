import { useEffect, useState } from "react";
import "./AuthorPage.scss";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import NavBar from "../../components/NavBar/NavBar";
import { db } from "../../config/firebase";
import Story from "../../components/Story/Story";
import LoadingBar from "../../components/LoadingBar/LoadingBar";
const AuthorPage = () => {
  const [loading, setLoading] = useState(true);
  const { authorId } = useParams();
  const [author, setAuthor] = useState<any>();
  const [stories, setStories] = useState<any>();
  useEffect(() => {
    const getAuthor = async () => {
      if (!authorId) return;
      const authorRef = doc(db, "users", authorId);
      const authSnap = await getDoc(authorRef);
      if (authSnap.exists()) {
        setAuthor(authSnap.data());
        getStories(authSnap.data().uid);
        setLoading(false);
      } else {
        console.log("Error");
      }
    };
    getAuthor();
  }, []);

  const getStories = async (uid: any) => {
    const storiesRef = collection(db, "stories");
    const q = query(storiesRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    const stories: any = [];
    querySnapshot.forEach((doc) => {
      stories.push({ ...doc.data(), docId: doc.id });
    });
    setStories(stories);
  };
  return (
    <div>
      <NavBar filterStories={() => {}} />
      <LoadingBar loading={loading} />
      {!author ? (
        <div></div>
      ) : (
        <div className="author__page">
          <div className="hero">
            <div className="content">
              <h1 className="stories__heading">Stories</h1>
              <ul className="stories__list">
                {stories &&
                  stories.map((story: any, i: number) => {
                    return (
                      <li className="author__story__list__item" key={i}>
                        <Story list={[]} isProfile={true} storyDoc={story} />
                      </li>
                    );
                  })}
              </ul>
            </div>
            <div className="profile">
              <div className="author__pic">
                <img className="profile__pic" src={author.photoURL} alt="" />
              </div>
              <p className="author__name"> {author.name}</p>
              <p className="author__bio">Born to write</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorPage;

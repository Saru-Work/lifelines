import { useEffect, useRef, useState } from "react";
import "./StoryPage.scss";
import trashIcon from "../../assets/icons/trash.svg";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
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
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentStatus, setCommentStatus] = useState(false);
  const commentRef = useRef<any>(null);
  const getLikeStatus = async () => {
    if (!storyId) return;
    // Referencing the stories collection
    const storyRef = doc(db, "stories", storyId);
    // Fetching likes
    const likesCollectionRef = collection(storyRef, "likes");
    const likedQuery = query(likesCollectionRef, where("liked", "==", true));
    const likedDocs = await getDocs(likedQuery);

    // Fetching comments
    const commentsCollectionRef = collection(storyRef, "comments");
    const commentDocs = await getDocs(commentsCollectionRef);
    const currentComments: any = [];
    commentDocs.forEach((doc) => {
      currentComments.push({ ...doc.data(), commentDocId: doc.id });
    });
    setComments(currentComments);

    setLikes(likedDocs.size);
  };
  function storeToLocalStorage() {
    if (userState.uid == "") return;
    try {
      localStorage.setItem("userLocalState", JSON.stringify(userState));
    } catch (err: any) {
      console.log(err.message);
    }
  }
  useEffect(() => {
    storeToLocalStorage();
    getLikeStatus();
  }, []);
  useEffect(() => {
    async function initialCheck() {
      // if (!userState.uid) return;
      if (!storyId) return;
      const storyRef = doc(db, "stories", storyId);
      const likesCollectionRef = collection(storyRef, "likes");
      const storedUser = localStorage.getItem("userLocalState");
      if (!storedUser) return;
      const likedRef = doc(
        likesCollectionRef,
        userState.uid || JSON.parse(storedUser).uid
      );
      const likedDoc = await getDoc(likedRef);

      if (likedDoc.exists()) {
        const data = likedDoc.data();
        if (data.liked === true) {
          setLikedClicked(true);
        } else {
          data.liked = false;
        }
      } else {
        setLikedClicked(false);
      }
    }
    initialCheck();
  }, []);

  async function commentStory() {
    if (!storyId || comment === "") return;

    setCommentStatus(true);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", userState.uid));
    const querySnapshot = await getDocs(q);
    let userDocId = "";

    querySnapshot.forEach((doc) => {
      userDocId = doc.id;
    });
    const storyRef = doc(db, "stories", storyId);
    const commentsCollectionRef = collection(storyRef, "comments");
    const docRef = await addDoc(commentsCollectionRef, {
      comment: comment,
      authorId: userState.uid,
      authorName: userState.displayName,
      createdAt: serverTimestamp(),
      userDocId: userDocId,
      photoUrl: userState.photoURL,
    });
    if (commentRef.current != null) {
      commentRef.current.value = "";
    }
    getLikeStatus();
    setCommentStatus(false);
  }
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
    const a = await setDoc(likedRef, {
      liked: true,
      likedAt: Timestamp.now(),
    });
    getLikeStatus();
  };
  async function deleteComment(id: string) {
    if (!storyId) return;
    const currentComments = comments.filter(
      (comment: any) => comment.commentDocId != id
    );
    setComments(currentComments);
    const storyRef = doc(db, "stories", storyId);
    await deleteDoc(doc(storyRef, "comments", id));
    getLikeStatus();
  }
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
          <div className="comment__input__area">
            <textarea
              ref={commentRef}
              onChange={(e) => {
                setComment(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              className="comment__input"
            ></textarea>
            <button
              onClick={commentStory}
              className="comment__btn"
              style={{
                cursor: commentStatus ? "not-allowed" : "pointer",
              }}
            >
              {commentStatus ? "...Comment" : "Comment"}
            </button>
          </div>
          <div className="comments__area">
            {comments.map((comment: any, i: number) => {
              return (
                <Comment
                  deleteComment={deleteComment}
                  key={i}
                  comment={comment}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

const Comment = ({
  comment,
  deleteComment,
}: {
  comment: any;
  deleteComment: any;
}) => {
  const userState = useSelector((state: RootState) => state.user);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseMove={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className="comment__frame"
    >
      <div className="comment__pic__container">
        <img className="comment__pic" src={comment.photoUrl} alt="" />
      </div>
      <div className="name__and__comment">
        <h4 className="comment__name">{comment.authorName}</h4>
        <p className="comment__content">{comment.comment}</p>
      </div>
      {comment.authorId === userState.uid && isHovered && (
        <button
          onClick={() => {
            deleteComment(comment.commentDocId);
          }}
          className="comment__delete__btn"
        >
          <img className="trash__icon" src={trashIcon} />
        </button>
      )}
    </div>
  );
};

export default StoryPage;

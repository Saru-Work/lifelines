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
import { formatDistanceToNow } from "date-fns";

const StoryPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState<any>();
  const [likes, setLikes] = useState(0);
  const [likeClicked, setLikeClicked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentStatus, setCommentStatus] = useState(false);
  const [userData, setUserData] = useState<any>();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!storyId) return;

    const fetchData = async () => {
      const storyRef = doc(db, "stories", storyId);
      const storySnap = await getDoc(storyRef);

      if (storySnap.exists()) {
        setStory(storySnap.data());

        const authorSnap = await getDocs(
          query(
            collection(db, "users"),
            where("uid", "==", storySnap.data().uid)
          )
        );
        authorSnap.forEach((doc) =>
          setUserData({ ...doc.data(), uid: doc.id })
        );

        const likesSnap = await getDocs(collection(storyRef, "likes"));
        setLikes(likesSnap.docs.filter((d) => d.data().liked === true).length);

        const commentSnap = await getDocs(collection(storyRef, "comments"));
        const allComments = commentSnap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        setComments(allComments);

        const likedSnap = await getDoc(
          doc(collection(storyRef, "likes"), userState.uid)
        );
        setLikeClicked(likedSnap.exists() && likedSnap.data().liked);
      }
      setLoading(false);
    };

    fetchData();
  }, [storyId]);

  const likeStory = async () => {
    if (!storyId) return;
    setLikeClicked(true);
    const storyRef = doc(db, "stories", storyId);
    await setDoc(doc(collection(storyRef, "likes"), userState.uid), {
      liked: true,
      likedAt: Timestamp.now(),
    });
    setLikes((prev) => prev + 1);
  };

  const unlikeStory = async () => {
    if (!storyId) return;
    setLikeClicked(false);
    const storyRef = doc(db, "stories", storyId);
    await setDoc(doc(collection(storyRef, "likes"), userState.uid), {
      liked: false,
      likedAt: Timestamp.now(),
    });
    setLikes((prev) => prev - 1);
  };

  const submitComment = async () => {
    if (!storyId || !comment.trim()) return;
    setCommentStatus(true);
    const storyRef = doc(db, "stories", storyId);
    const commentsRef = collection(storyRef, "comments");
    const newComment = {
      comment,
      authorId: userState.uid,
      authorName: userState.displayName,
      createdAt: serverTimestamp(),
      photoUrl: userState.photoURL,
    };
    await addDoc(commentsRef, newComment);
    setComment("");
    commentRef.current!.value = "";
    setCommentStatus(false);
    const snap = await getDocs(commentsRef);
    setComments(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  const deleteComment = async (id: string) => {
    if (!storyId) return;
    const storyRef = doc(db, "stories", storyId);
    await deleteDoc(doc(collection(storyRef, "comments"), id));
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="story__page">
      <LoadingBar loading={loading} />
      <NavBar filterStories={() => {}} />
      {!story || !userData ? null : (
        <div className="hero">
          <div className="story__profile__container">
            <Link className="link" to={`/author/${userData.uid}`}>
              <div className="nameandphoto">
                <img
                  className="story__author__picture"
                  src={userData.photoURL}
                  alt=""
                />
                <p className="story__author__name">{userData.name}</p>
              </div>
            </Link>
          </div>
          <div className="story__container">
            <h1 className="title">{story.title}</h1>
            <div className="story">{story.story}</div>
            <div className="buttons">
              <div className="like__btn__container">
                <div
                  onClick={() => (likeClicked ? unlikeStory() : likeStory())}
                  className={`like__btn ${likeClicked ? "clicked" : ""}`}
                  title={likeClicked ? "Unlike" : "Like"}
                ></div>
                <p>{likes}</p>
              </div>
            </div>
          </div>

          <div className="comment__input__area">
            <textarea
              ref={commentRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment__input"
              disabled={commentStatus}
            />
            <button
              onClick={submitComment}
              className="comment__btn"
              disabled={commentStatus || comment.trim() === ""}
            >
              {commentStatus ? "...Commenting" : "Comment"}
            </button>
          </div>

          <div className="comments__area">
            {comments.map((c) => (
              <Comment key={c.id} comment={c} deleteComment={deleteComment} />
            ))}
          </div>
        </div>
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
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="comment__frame"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="comment__pic__container">
        <img className="comment__pic" src={comment.photoUrl} alt="" />
      </div>
      <div className="name__and__comment">
        <h4 className="comment__name">{comment.authorName}</h4>
        <p className="comment__content">{comment.comment}</p>
        {comment.createdAt?.seconds && (
          <p className="comment__time">
            {formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
      {comment.authorId === userState.uid && hovered && (
        <button
          onClick={() => deleteComment(comment.id)}
          className="comment__delete__btn"
          title="Delete Comment"
        >
          <img className="trash__icon" src={trashIcon} alt="Delete" />
        </button>
      )}
    </div>
  );
};

export default StoryPage;

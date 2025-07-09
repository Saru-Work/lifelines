import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Firestore,
  serverTimestamp,
  addDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Get user document data by UID
export const getUserDataByUid = async (uid: string, db: Firestore) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", uid));
  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    return { ...docSnap.data(), uid: docSnap.id };
  }
  return null;
};

// Get a single story by ID
export const getStoryById = async (storyId: string, db: Firestore) => {
  const storyRef = doc(db, "stories", storyId);
  const snap = await getDoc(storyRef);
  return snap.exists() ? snap.data() : null;
};

// Get all likes (true only) for a story
export const getLikesCount = async (storyId: string, db: Firestore) => {
  const storyRef = doc(db, "stories", storyId);
  const likesRef = collection(storyRef, "likes");
  const likedQuery = query(likesRef, where("liked", "==", true));
  const snapshot = await getDocs(likedQuery);
  return snapshot.size;
};

// Get all comments for a story
export const getComments = async (storyId: string, db: Firestore) => {
  const storyRef = doc(db, "stories", storyId);
  const commentsRef = collection(storyRef, "comments");
  const snapshot = await getDocs(commentsRef);
  return snapshot.docs.map((doc) => ({ ...doc.data(), commentDocId: doc.id }));
};

// Check if user has liked a story
export const hasUserLiked = async (
  storyId: string,
  uid: string,
  db: Firestore
) => {
  const likedRef = doc(db, "stories", storyId, "likes", uid);
  const likedSnap = await getDoc(likedRef);
  return likedSnap.exists() && likedSnap.data().liked === true;
};

// Like or unlike a story
export const updateUserLikeStatus = async (
  storyId: string,
  uid: string,
  liked: boolean,
  db: Firestore
) => {
  const storyRef = doc(db, "stories", storyId);
  const likedRef = doc(collection(storyRef, "likes"), uid);
  await setDoc(likedRef, {
    liked,
    likedAt: Timestamp.now(),
  });
};

// Post a new comment
export const postComment = async (
  storyId: string,
  user:
    | {
        uid: string;
        displayName: string;
        photoURL: string;
      }
    | any,
  userDocId: string,
  comment: string,
  db: Firestore
) => {
  const storyRef = doc(db, "stories", storyId);
  const commentsRef = collection(storyRef, "comments");
  return await addDoc(commentsRef, {
    comment,
    authorId: user.uid,
    authorName: user.displayName,
    photoUrl: user.photoURL,
    userDocId,
    createdAt: serverTimestamp(),
  });
};

// Delete a comment
export const deleteCommentById = async (
  storyId: string,
  commentId: string,
  db: Firestore
) => {
  const storyRef = doc(db, "stories", storyId);
  await deleteDoc(doc(storyRef, "comments", commentId));
};

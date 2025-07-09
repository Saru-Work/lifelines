import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./Feed.scss";
import Story from "../../components/Story/Story";
import Shimmer from "../../components/Shimmer/Shimmer";

interface StoryType {
  authorName: string;
  profileUrl: string;
  docId: string;
  title: string;
  story: string;
  uid: string;
  createdAt: string;
  name?: string;
  photoUrl?: string;
  userId?: string;
  likes?: number;
  comments?: number;
}

const Feed = () => {
  const [stories, setStories] = useState<StoryType[]>([]);
  const [filteredStories, setFilteredStories] = useState<StoryType[]>([]);

  const getStoryMeta = async (uid: string, storyId: string) => {
    const userQuery = query(collection(db, "users"), where("uid", "==", uid));
    const userSnap = await getDocs(userQuery);
    const likesRef = collection(db, "stories", storyId, "likes");
    const commentsRef = collection(db, "stories", storyId, "comments");

    const [likesSnap, commentsSnap] = await Promise.all([
      getDocs(query(likesRef, where("liked", "==", true))),
      getDocs(commentsRef),
    ]);

    const user = userSnap.docs[0]?.data();
    return {
      name: user?.name || "Unknown",
      photoUrl: user?.photoURL || "",
      userId: userSnap.docs[0]?.id || "",
      likes: likesSnap.size,
      comments: commentsSnap.size,
    };
  };

  const fetchStories = async () => {
    const snap = await getDocs(collection(db, "stories"));
    const storyData = await Promise.all(
      snap.docs.map(async (doc) => {
        const base = doc.data();
        const meta = await getStoryMeta(base.uid, doc.id);
        return { ...base, ...meta, docId: doc.id } as StoryType;
      })
    );
    setStories(storyData);
    setFilteredStories(storyData);
  };

  const filterStories = (input: string) => {
    const query = input.toLowerCase();
    const filtered = stories.filter((s) =>
      s.story.toLowerCase().includes(query)
    );
    setFilteredStories(filtered);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="feed">
      <NavBar filterStories={filterStories} />
      <div className="feed__hero">
        <div className="right">
          <h2 className="foryou">For You</h2>
          <div className="stories">
            <ul>
              {filteredStories.length > 0
                ? filteredStories.map((storyDoc) => (
                    <li key={storyDoc.docId}>
                      <Story list={[]} isProfile={false} storyDoc={storyDoc} />
                    </li>
                  ))
                : new Array(10).fill(null).map((_, i) => (
                    <li key={i}>
                      <Shimmer />
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        <div className="left__area">
          <h1>LifeLines</h1>
          <p>
            LifeLines is a personal blog app for sharing stories and insights on
            life. It offers a user-friendly platform for writing, reading, and
            connecting through posts on personal growth, travel, hobbies, and
            more.
          </p>
          <ul>
            <li>
              <h3>Personalized Content</h3>
              <p>
                Create and share your unique stories, experiences, and
                reflections across a wide range of topics.
              </p>
            </li>
            <li>
              <h3>User-Friendly Interface</h3>
              <p>
                Navigate easily whether you’re writing or exploring others’
                stories with an intuitive UI.
              </p>
            </li>
            <li>
              <h3>Post Creation & Editing</h3>
              <p>
                Edit and update your posts anytime to reflect your evolving
                thoughts. (Editing coming soon)
              </p>
            </li>
            <li>
              <h3>Interactive Community</h3>
              <p>
                Comment on, like, and share stories to build meaningful
                interactions with the community.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feed;

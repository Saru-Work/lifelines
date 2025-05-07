import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./Feed.scss";
import Story from "../../components/Story/Story";
import Shimmer from "../../components/Shimmer/Shimmer";
interface story {
  authorName: string;
  profileUrl: string;
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
  const [totalStories, setTotalStories] = useState<story[] | []>([]);

  // Filter stories for search
  const filterStories = (input: string) => {
    const filteredStories = totalStories.filter((story) => {
      return story.story.includes(input);
    });
    setStories(filteredStories);
  };

  useEffect(() => {
    const getStories = async () => {
      const querySnapshot = await getDocs(collection(db, "stories"));
      const data: any = [];

      querySnapshot.forEach(async (doc) => {
        data.push({
          ...doc.data(),
          docId: doc.id,
        });
      });
      setStories(data);
      setTotalStories(data);
    };
    getStories();
  }, []);

  return (
    <div className="feed">
      <NavBar filterStories={filterStories} />
      <div className="feed__hero">
        <div className="right">
          <div className="stories">
            <ul>
              {stories.length !== 0
                ? stories.map((story) => {
                    return (
                      <li key={story.docId}>
                        <Story list={[]} isProfile={false} story={story} />
                      </li>
                    );
                  })
                : new Array(10).fill(null).map((_, i) => {
                    return (
                      <li key={i}>
                        <Shimmer />
                      </li>
                    );
                  })}
            </ul>
          </div>
        </div>
        <div className="left"></div>
      </div>
    </div>
  );
};

export default Feed;

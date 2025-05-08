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
          <h2 className="foryou">For You</h2>
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
        <div className="left__area">
          <h1>LifeLines</h1>
          <p>
            LifeLines is a personal blog app designed to share stories,
            experiences, and insights on various aspects of life. With a clean
            and user-friendly interface, it allows users to write and explore
            articles on topics ranging from personal growth and relationships to
            travel and hobbies.
          </p>
          <p>
            LifeLines aims to create a space for self-expression, connection,
            and inspiration, where every story adds a unique line to the
            collective journey of life.
          </p>

          <ul>
            <li>
              <h3>Personalized Content</h3>
              <p>
                LifeLines allows users to create and share their own stories and
                experiences, making it a personal space for self-expression.
                From personal growth to hobbies, users can write about anything
                that resonates with them.
              </p>
            </li>
            <li>
              <h3>User-Friendly Interface</h3>
              <p>
                The app offers an intuitive and simple design, making it easy
                for anyone to navigate, whether they’re writing a post or
                browsing through others’ stories.
              </p>
            </li>
            <li>
              <h3>Post Creation & Editing</h3>
              <p>
                LifeLines enables users to write, edit, and update their posts
                at any time. This flexibility empowers writers to keep their
                content up-to-date or add new thoughts as they grow and evolve.(
                Editing is coming soon)
              </p>
            </li>
            <li>
              <h3>Interactive Community</h3>
              <p>
                The app encourages interaction by allowing users to comment on,
                like, and share stories. This fosters a sense of community and
                connection among readers and writers.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feed;

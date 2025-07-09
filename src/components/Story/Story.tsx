import { useState } from "react";
import userIcon from "../../assets/icons/user.png";
import { motion } from "motion/react";
import "./Story.scss";
import { Link } from "react-router-dom";
import DropDown from "../DropDown/DropDown";
import { animate } from "motion";
const Story = ({
  storyDoc,
  isProfile,
  list,
}: {
  storyDoc: any;
  isProfile: boolean;
  list: any;
}) => {
  const { docId, title, story, name, photoUrl, userId, likes, comments } =
    storyDoc;
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      }}
      className="story"
    >
      {!isProfile && (
        <Link className="user__navigation" to={"/author/" + userId || ""}>
          <div className="profile__container">
            <img className="author__profile__img" src={photoUrl || userIcon} />
            <p className="author__name">{name}</p>
          </div>
        </Link>
      )}
      <Link className="story__navigation" to={"/story/" + docId}>
        <h2 className="story__title">{title}</h2>
        <p className="story__content">{story}</p>
      </Link>
      <div className="action__btn__container">
        <div className="landc">
          <div className="like__container">
            <span>❤️</span>
            <span>{likes}</span>
          </div>
          <div className="comment__container">
            <span>💬</span>
            <span>{comments}</span>
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
                storyId={docId}
                list={list}
                setIsDropDownOpen={setIsDropDownOpen}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Story;

import LogoImg from "../../assets/logo/LIfeLines.png";
import NotificationImg from "../../assets/icons/notification.svg";
import ProfilePicture from "../../assets/icons/user.png";
import { motion, AnimatePresence } from "motion/react";
import "./Write.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useEffect, useRef, useState } from "react";
import { removeUser } from "../../state/userSlice";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import libraryIcon from "../../assets/icons/library.svg";
import statsIcon from "../../assets/icons/stats.svg";
import profileIcon from "../../assets/icons/profile.svg";
import storiesIcon from "../../assets/icons/stories.svg";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Write = () => {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [titleText, setTitleText] = useState("");
  const [contentText, setContentText] = useState("");
  const [profileDD, setProfileDD] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);

  interface ProfileItem {
    content: string;
    icon: string;
    action: () => void;
  }

  const profileDropDownItems: ProfileItem[] = [
    {
      content: "Profile",
      icon: profileIcon,
      action: () => {
        navigate("/me");
        setProfileDD(false);
      },
    },
    {
      content: "Library",
      icon: libraryIcon,
      action: () => {
        setProfileDD(false);
      },
    },
    {
      content: "Stories",
      icon: storiesIcon,
      action: () => {
        setProfileDD(false);
      },
    },
    {
      content: "Stats",
      icon: statsIcon,
      action: () => {
        setProfileDD(false);
      },
    },
  ];

  const storeStory = async () => {
    if (!titleText.trim() || !contentText.trim()) return;
    try {
      await addDoc(collection(db, "stories"), {
        uid: userState.uid,
        title: titleText.trim(),
        story: contentText.trim(),
        comments: [],
        likes: 0,
        createdAt: Timestamp.now(),
      });
      resetInputFields();
      navigate("/feed");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const resetInputFields = () => {
    if (titleRef.current) {
      titleRef.current.innerText = "";
      setTitleText("");
    }
    if (contentRef.current) {
      contentRef.current.innerText = "";
      setContentText("");
    }
  };

  return (
    <div className="write__page">
      <nav>
        <div className="left">
          <Link to="/feed" aria-label="Go to feed">
            <img src={LogoImg} alt="LifeLines logo" />
          </Link>
          <p className="name" aria-label="User display name">
            {userState.displayName || "User"}
          </p>
        </div>
        <div className="right">
          <button
            disabled={!titleText.trim() || !contentText.trim()}
            onClick={() => setOpenPublish(true)}
            className="publish__btn"
            aria-disabled={!titleText.trim() || !contentText.trim()}
            aria-label="Publish story"
            title={
              !titleText.trim() || !contentText.trim()
                ? "Enter title and content to publish"
                : "Publish your story"
            }
          >
            Publish
          </button>
          <img
            src={NotificationImg}
            alt="Notifications"
            className="notification__icon"
            role="button"
            tabIndex={0}
          />
          <div className="profile__picture__area" aria-haspopup="true">
            <img
              onClick={() => setProfileDD((prev) => !prev)}
              className="profile__picture"
              src={userState.photoURL || ProfilePicture}
              alt="User profile"
              role="button"
              tabIndex={0}
            />
            <DropDown
              items={profileDropDownItems}
              profileDD={profileDD}
              setProfileDD={setProfileDD}
              dispatch={dispatch}
            />
          </div>
        </div>
      </nav>

      <section className="story__area">
        <div className="title__area" aria-label="Story title editor">
          {(!titleText || titleText.trim() === "") && (
            <div className="title__placeholder">Title</div>
          )}
          <h3
            ref={titleRef}
            onInput={() => setTitleText(titleRef.current?.innerText ?? "")}
            className="title"
            contentEditable
            suppressContentEditableWarning
            spellCheck={true}
            aria-multiline="true"
            role="textbox"
            tabIndex={0}
          ></h3>
        </div>

        <div className="content__area" aria-label="Story content editor">
          {(!contentText || contentText.trim() === "") && (
            <div className="content__placeholder">Write your story here...</div>
          )}
          <p
            ref={contentRef}
            onInput={() => setContentText(contentRef.current?.innerText ?? "")}
            className="content"
            contentEditable
            suppressContentEditableWarning
            spellCheck={true}
            aria-multiline="true"
            role="textbox"
            tabIndex={0}
          ></p>
        </div>
      </section>

      <PublishConfirm
        openPublish={openPublish}
        setOpenPublish={setOpenPublish}
        storeStory={storeStory}
        resetInputFields={resetInputFields}
      />
    </div>
  );
};

interface DropDownProps {
  items: {
    content: string;
    icon: string;
    action: () => void;
  }[];
  profileDD: boolean;
  setProfileDD: (state: boolean) => void;
  dispatch: any;
}

const DropDown = ({
  items,
  profileDD,
  setProfileDD,
  dispatch,
}: DropDownProps) => {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropDown = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setProfileDD(false);
      }
    };
    document.addEventListener("mousedown", closeDropDown);
    return () => {
      document.removeEventListener("mousedown", closeDropDown);
    };
  }, [setProfileDD]);

  const signOutUser = () => {
    dispatch(removeUser());
    signOut(auth).catch(console.error);
    setProfileDD(false);
  };

  return (
    <AnimatePresence>
      {profileDD && (
        <motion.div
          ref={dropDownRef}
          className="write__dropdown"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          role="menu"
          aria-label="Profile dropdown menu"
        >
          <ul>
            {items.map((item, i) => (
              <li
                key={i}
                className="dropdown__li"
                onClick={() => item.action()}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") item.action();
                }}
              >
                <img
                  className="li__icon"
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                />
                <span>{item.content}</span>
              </li>
            ))}
          </ul>
          <hr />
          <ul>
            <li className="drop__li" role="menuitem" tabIndex={0}>
              Settings
            </li>
            <li
              className="drop__li"
              role="menuitem"
              tabIndex={0}
              onClick={signOutUser}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") signOutUser();
              }}
            >
              Log Out
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PublishConfirmProps {
  openPublish: boolean;
  setOpenPublish: (state: boolean) => void;
  storeStory: () => void;
  resetInputFields: () => void;
}

const PublishConfirm = ({
  openPublish,
  setOpenPublish,
  storeStory,
  resetInputFields,
}: PublishConfirmProps) => {
  const publishConfirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closePublish = (e: MouseEvent) => {
      if (
        publishConfirmRef.current &&
        !publishConfirmRef.current.contains(e.target as Node)
      ) {
        setOpenPublish(false);
      }
    };
    document.addEventListener("mousedown", closePublish);
    return () => {
      document.removeEventListener("mousedown", closePublish);
    };
  }, [setOpenPublish]);

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {openPublish && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="confirm__container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-dialog-title"
        >
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={publishConfirmRef}
            className="publish__confirm"
          >
            <h3 id="publish-dialog-title">Publish</h3>
            <p className="confirmation__request">
              Are you sure you want to publish?
            </p>
            <div className="btn__container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn confirm__btn"
                onClick={() => {
                  storeStory();
                  setOpenPublish(false);
                }}
                aria-label="Confirm publish"
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn cancel__btn"
                onClick={() => setOpenPublish(false)}
                aria-label="Cancel publish"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Write;

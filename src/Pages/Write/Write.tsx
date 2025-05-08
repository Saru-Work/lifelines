import LogoImg from "../../assets/logo/LIfeLines.png";
import NotificationImg from "../../assets/icons/notification.svg";
import ProfilePicture from "../../assets/icons/user.png";
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
  const [titleText, setTitleText] = useState("");
  const [contentText, setContentText] = useState("");
  const contentRef = useRef<HTMLParagraphElement>(null);
  const userState = useSelector((state: RootState) => state.user);
  const [profileDD, setProfileDD] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  interface profileItemsInterface {
    content: string;
    icon: string;
    action: () => void;
  }
  const profileDropDownItems: profileItemsInterface[] = [
    {
      content: "Profile",
      icon: profileIcon,
      action: () => {
        let id = "";
        for (let i = 0; userState.email[i] != "@"; i++) {
          id += userState.email[i];
        }
        navigate("/me");
      },
    },
    { content: "Library", icon: libraryIcon, action: () => {} },
    { content: "Stories", icon: storiesIcon, action: () => {} },
    { content: "Stats", icon: statsIcon, action: () => {} },
  ];

  // Store the story into the firebase
  const storeStory = async () => {
    try {
      const docRef = await addDoc(collection(db, "stories"), {
        uid: userState.uid,
        title: titleText,
        story: contentText,
        comments: "",
        likes: 0,
        createdAt: Timestamp.now(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <div className="write__page">
      <nav>
        <div className="left">
          <Link to="/feed">
            <img src={LogoImg} alt="" />
          </Link>
          <p className="name">{userState.displayName}</p>
        </div>
        <div className="right">
          <button
            onClick={() => {
              if (contentRef.current?.innerText.trim() === "") return;
              setOpenPublish(true);
            }}
            className="publish__btn"
          >
            Publish
          </button>
          <div>
            <img src={NotificationImg} className="notification__icon" alt="" />
          </div>
          <div className="profile__picture__area">
            <img
              onClick={() => {
                setProfileDD(true);
              }}
              className="profile__picture"
              src={userState.photoURL || ProfilePicture}
            />
            <DropDown
              items={profileDropDownItems}
              profileDD={profileDD}
              setProfileDD={setProfileDD}
            />
          </div>
        </div>
      </nav>
      <section className="story__area">
        <div className="title__area">
          {!titleRef.current ||
          titleRef.current.innerText.trim().length === 0 ? (
            <div className="title__placeholder">Title</div>
          ) : null}

          <h3
            ref={titleRef}
            onInput={() => {
              if (!titleRef.current) return;
              setTitleText(titleRef.current?.innerText);
            }}
            className="title"
            contentEditable
            suppressContentEditableWarning={true}
          ></h3>
        </div>
        <div className="content__area">
          {!contentRef.current ||
          contentRef.current.innerText.trim().length === 0 ? (
            <div className="content__placeholder">Write your story here...</div>
          ) : null}

          <p
            ref={contentRef}
            onInput={() => {
              if (!contentRef.current) return;
              setContentText(contentRef.current?.innerText);
            }}
            className="content"
            contentEditable
            suppressContentEditableWarning={true}
          ></p>
        </div>
      </section>
      {openPublish && (
        <PublishConfirm
          setOpenPublish={setOpenPublish}
          storeStory={storeStory}
        />
      )}
    </div>
  );
};
interface props {
  items: {
    content: string;
    icon: string;
    action: () => void;
  }[];
  profileDD: boolean;
  setProfileDD: (state: boolean) => void;
}
const DropDown = ({ items, profileDD, setProfileDD }: props) => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function closeDropDown(e: MouseEvent | any) {
      if (
        dropDownRef.current &&
        !dropDownRef.current?.contains(e.target as Node)
      ) {
        setProfileDD(false);
      }
    }
    document.addEventListener("mousedown", (e) => {
      closeDropDown(e);
    });
  }, []);
  const dispatch = useDispatch();
  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign Out Successfull");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      {profileDD && (
        <div ref={dropDownRef} className="write__dropdown">
          <ul>
            {items.map((item, i) => {
              return (
                <li
                  key={i}
                  className="dropdown__li"
                  onClick={() => {
                    item.action();
                  }}
                >
                  <span>
                    <img className="li__icon" src={item.icon} alt="" />
                  </span>
                  <span>{item.content}</span>
                </li>
              );
            })}
          </ul>
          <hr />
          <ul>
            <li className="drop__li">Settings</li>
            <li
              className="drop__li"
              onClick={() => {
                dispatch(removeUser());
                signOutUser();
              }}
            >
              Log Out
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
interface publishProps {
  setOpenPublish: (state: boolean) => void;
  storeStory: () => void;
}
const PublishConfirm = ({ setOpenPublish, storeStory }: publishProps) => {
  const publishConfirmRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const closePublish = (e: MouseEvent | any) => {
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
  }, []);
  return (
    <div className="confirm__container">
      <div ref={publishConfirmRef} className="publish__confirm">
        <h3>Publish</h3>
        <p className="confirmation__request">
          Are you sure you want to publish?
        </p>
        <div>
          <button
            className="btn confirm__btn"
            onClick={() => {
              storeStory();
              setOpenPublish(false);
            }}
          >
            Confirm
          </button>
          <button
            className="btn cancel__btn"
            onClick={() => {
              setOpenPublish(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Write;

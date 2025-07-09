import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AnimatePresence, motion } from "motion/react";
import { removeUser } from "../../state/userSlice";
import { auth } from "../../config/firebase";
import { RootState } from "../../state/store";
import searchIcon from "../../assets/icons/search.svg";
import logo from "../../assets/logo/LIfeLines.png";
import writeIcon from "../../assets/icons/write.svg";
import notificationIcon from "../../assets/icons/notification.svg";
import userIcon from "../../assets/icons/user.png";
import profileIcon from "../../assets/icons/profile.svg";
import storiesIcon from "../../assets/icons/stories.svg";
import statsIcon from "../../assets/icons/stats.svg";
import libraryIcon from "../../assets/icons/library.svg";
import settingIcon from "../../assets/icons/settings.svg";
import logoutIcon from "../../assets/icons/signout.svg";
import "./NavBar.scss";

const NavBar = ({
  filterStories,
}: {
  filterStories: (term: string) => void;
}) => {
  const userState = useSelector((state: RootState) => state.user);
  const [profileDD, setProfileDD] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const profileDropDownItems = [
    {
      content: "Profile",
      icon: profileIcon,
      action: () => navigate("/me"),
    },
    {
      content: "Library",
      icon: libraryIcon,
      action: () => navigate("/library"),
    },
    {
      content: "Stories",
      icon: storiesIcon,
      action: () => navigate("/stories"),
    },
    {
      content: "Stats",
      icon: statsIcon,
      action: () => navigate("/stats"),
    },
  ];

  return (
    <div className="nav__bar">
      <div className="left">
        <Link to="/feed">
          <img className="logo__img" src={logo} alt="logo" />
        </Link>
        <div className="search__wrapper">
          <img className="search__icon" src={searchIcon} alt="search" />
          <input
            className="search__bar"
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value;
              setSearchInput(value);
              filterStories(value);
            }}
          />
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/write">
              <img className="write__icon icon" src={writeIcon} alt="write" />
            </Link>
          </li>
          <li>
            <img
              className="notification__icon icon"
              src={notificationIcon}
              alt="notify"
            />
          </li>
          <li className="user">
            <DropDown
              items={profileDropDownItems}
              profileDD={profileDD}
              setProfileDD={setProfileDD}
            />
            <img
              onClick={() => setProfileDD((prev) => !prev)}
              className="icon user__icon"
              src={userState.photoURL || userIcon}
              alt="user"
            />
          </li>
        </ul>
      </nav>
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
}

const DropDown = ({ items, profileDD, setProfileDD }: DropDownProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropDownRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setProfileDD(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setProfileDD]);

  const signOutUser = () => {
    signOut(auth);
  };

  const dropDownVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {profileDD && (
        <motion.ul
          ref={dropDownRef}
          className="dropdown"
          variants={dropDownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {items.map((item, i) => (
            <li
              key={i}
              className="dropdown__li"
              onClick={() => {
                item.action();
                setProfileDD(false);
              }}
            >
              <img className="li__icon" src={item.icon} alt={item.content} />
              <span>{item.content}</span>
            </li>
          ))}
          <li className="drop__li" onClick={() => navigate("/settings")}>
            <img src={settingIcon} alt="settings" />
            <span>Settings</span>
          </li>
          <li
            className="drop__li"
            onClick={() => {
              dispatch(removeUser());
              signOutUser();
              navigate("/");
            }}
          >
            <img src={logoutIcon} alt="logout" />
            <span>Log out</span>
          </li>
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default NavBar;

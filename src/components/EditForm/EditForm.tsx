import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../config/firebase";
import { updateProfile } from "firebase/auth";
import "./EditForm.scss";
import { updateUserConfig } from "../../state/userSlice";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../assets/icons/user.png";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { RootState } from "../../state/store";
interface props {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}
const EditForm = ({ isOpen, setIsOpen }: props) => {
  const [image, setImage] = useState();
  const [pending, setPending] = useState(false);
  const userState = useSelector((state: RootState) => state.user);
  const [imgUrl, setImgUrl] = useState<any>(userState.photoURL || userIcon);
  const nameRef = useRef(null);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState<any>(userState.displayName);

  useEffect(() => {
    function updateState() {
      setFullName(userState.displayName);
    }
    updateState();
  }, [userState]);

  const uploadPicture = async () => {
    if (image) {
      setPending(true);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "blog_app_profiles");
      data.append("cloud_name", "dloskjrvi");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dloskjrvi/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const result = await res.json();
        setImgUrl(result.secure_url);
        await updateProfile(auth.currentUser!, {
          displayName: fullName,
          photoURL: result.secure_url,
        });
        dispatch(
          updateUserConfig({
            displayName: fullName,
            photoURL: result.secure_url,
          })
        );
        await updateProfileConfig(userState.uid, fullName, result.secure_url);

        console.log("Profile updated successfully!");
        setIsOpen(false);
      } catch (err: any) {
        console.error("Upload or update failed:", err.message);
      } finally {
        setPending(false);
      }
    } else {
      await updateProfile(auth.currentUser!, {
        displayName: fullName,
        photoURL: auth.currentUser?.photoURL,
      });
      dispatch(
        updateUserConfig({
          displayName: fullName,
          photoURL: auth.currentUser?.photoURL,
        })
      );
      await updateProfileConfig(
        userState.uid,
        fullName,
        auth.currentUser?.photoURL
      );
    }
  };
  const updateProfileConfig = async (
    uid: string,
    newName: string,
    photoUrl: any
  ) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "users", document.id);
      await updateDoc(docRef, {
        name: newName,
        photoURL: photoUrl,
      });
    });
  };

  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    function closeEditForm(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setImgUrl(auth.currentUser?.photoURL);
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", (e) => {
      closeEditForm(e);
    });
  }, []);
  return (
    <div className={`edit__form ${isOpen ? "show " : null}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        action=""
        ref={formRef}
      >
        <h1>Profile Information</h1>
        <div>
          <label className="label">Photo</label>
          <div className="photo__line">
            <div className="profile__frame">
              <img
                className="profile__picture"
                src={imgUrl ? imgUrl : userIcon}
                alt=""
              />
            </div>
            <div>
              <div>
                <label htmlFor="file__upload" className="btn update__btn">
                  Update
                </label>
                <input
                  onChange={(e: any) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImgUrl(url);
                    }
                    setImage(file);
                  }}
                  className="update__input"
                  type="file"
                  id="file__upload"
                  name="upload"
                />
                <button className="btn remove__btn">Remove</button>
              </div>
              <p>
                Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
                side.
              </p>
            </div>
          </div>
        </div>
        <div className="input__container">
          <label htmlFor="">Name*</label>
          <input
            ref={nameRef}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            type="text"
          />
        </div>
        <div className="input__container">
          <label htmlFor="">Genre</label>
          <input type="text" />
        </div>
        <div className="input__container">
          <label htmlFor="">Bio</label>
          <textarea rows={3} name="bio" id="bio" className="bio" />
        </div>
        <div className="footer__btns">
          <button
            onClick={() => {
              setImgUrl(auth.currentUser?.photoURL);
              setIsOpen(false);
            }}
            className="cancel__btn btn"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              uploadPicture();
              setIsOpen(false);
            }}
            className="save__btn btn"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;

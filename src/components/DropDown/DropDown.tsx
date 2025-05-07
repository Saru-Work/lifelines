import { useEffect, useRef } from "react";
import "./DropDown.scss";

const DropDown = ({
  list,
  storyId,
  setIsDropDownOpen,
}: {
  list: any;
  storyId: string;
  setIsDropDownOpen: (state: boolean) => void;
}) => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let ready = false;
    const timeout = setTimeout(() => {
      ready = true;
    }, 10);
    function closeDropDown(e: MouseEvent) {
      if (
        ready &&
        dropDownRef.current &&
        !dropDownRef.current?.contains(e.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    }

    document.addEventListener("click", closeDropDown);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", closeDropDown);
    };
  }, []);
  return (
    <div
      ref={dropDownRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="option__dropdown"
    >
      <ul>
        {list.map((item: any, i: number) => {
          return (
            <li
              className="options__li"
              key={i}
              onClick={() => {
                item.handleClick(storyId);
                setIsDropDownOpen(false);
              }}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DropDown;

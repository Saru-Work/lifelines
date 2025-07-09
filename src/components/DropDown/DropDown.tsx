import { useEffect, useRef } from "react";
import "./DropDown.scss";

interface DropDownItem {
  name: string;
  handleClick: (id: string) => void;
}

interface DropDownProps {
  list: DropDownItem[];
  storyId: string;
  setIsDropDownOpen: (open: boolean) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  list,
  storyId,
  setIsDropDownOpen,
}) => {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsDropDownOpen]);

  return (
    <div
      ref={dropDownRef}
      className="option__dropdown"
      role="menu"
      onClick={(e) => e.stopPropagation()}
    >
      <ul>
        {list.map((item, index) => (
          <li
            key={index}
            className="options__li"
            role="menuitem"
            tabIndex={0}
            onClick={() => {
              item.handleClick(storyId);
              setIsDropDownOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                item.handleClick(storyId);
                setIsDropDownOpen(false);
              }
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropDown;

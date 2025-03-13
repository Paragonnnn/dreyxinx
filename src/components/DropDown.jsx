import React from "react";
import { Link } from "react-router-dom";

const DropDown = ({toggleDropDown, setToggleDropDown}) => {
  return (
    <div>
      {toggleDropDown && (
        <ul className=" absolute top-[30px] right-0 flex flex-col bg-darkBg px-3 py-1 gap-1 text-lg rounded w-[150px] z-50 text-white">
          <Link to={`/profile`} onClick={() => setToggleDropDown(false)}>Profile</Link>
          <Link to={`/bookmark`} onClick={() => setToggleDropDown(false)}>Bookmarks</Link>
        </ul>
      )}
    </div>
  );
};

export default DropDown;

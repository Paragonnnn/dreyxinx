import React from "react";

const Menu = ({openMenu, setOpenMenu}) => {
  const handleOpenMenu = () => {
    setOpenMenu(true)
    console.log(openMenu);
    
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className=" stroke-white h-5 cursor-pointer col-span-1" onClick={handleOpenMenu}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M4 6H20M4 12H14M4 18H9"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
};

export default Menu;

import React, { useContext } from "react";
import SearchSvg from "../assets/Search";
import Menu from "../assets/Menu";
import User from "../assets/User";
import { Link } from "react-router-dom";
import { userContext } from "../context";
import cookies from "js-cookie";
import api from "../api";
import { toast } from "react-toastify";

const Header = ({ openMenu, setOpenMenu, openSignIn, setOpenSignIn }) => {
  const { user, setAccessToken } = useContext(userContext);

  const notifySuccess = (message) =>
    toast.success(message, {
      theme: "dark",
    });

  const handleLogout = () => {
    api
      .post(
        "/user/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response.data);
        setAccessToken(null);
        notifySuccess(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <header className=" bg-darkBg text-white grid grid-cols-3 justify-between px-1 sm:px-2 md:px-4 items-center py-1 sticky top-0 z-30">
      <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />
      {/* <div className="flex gap-4 border-b pb-1 w-3/5">
        <SearchSvg />
        <input
          type="search"
          name=""
          id=""
          placeholder="Search and click enter"
          className=" bg-transparent w-full outline-none text-white placeholder:text-[#b9b9b9] searchBtn "
        />
      </div> */}
      <Link
        to={"/"}
        className=" font-bold text-[24px] cursor-pointer col-span-1 flex justify-center"
      >
        DreyxInk
      </Link>
      <div className=" col-span-1 flex justify-end">
        {user?.user ? (
          <div className=" cursor-pointer">
            {user.user.username}
          </div>
        ) : (
          <div
            className=" flex items-center gap-1 cursor-pointer hover:opacity-80"
            onClick={() => {
              setOpenSignIn(true);
              console.log(openSignIn);
            }}
          >
            <div className=" ">Sign In</div>
            <User />
          </div>
        )}
      </div>
      {/* <div className=" flex items-center gap-1 cursor-pointer hover:opacity-80" onClick={() => {setOpenSignIn(true); console.log(openSignIn);
      }}>
        <div className=" ">Sign In</div>
        <User />
      </div> */}
    </header>
  );
};

export default Header;

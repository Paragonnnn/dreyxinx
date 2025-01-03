import React, { useContext } from "react";
import SearchSvg from "../assets/Search";
import api from "../api";
import { toast } from "react-toastify";
import { userContext } from "../context";

const Navbar = ({ openMenu, setOpenMenu }) => {
  const closeMenu = () => {
    setOpenMenu(false);
  };

  const { user, setAccessToken } = useContext(userContext);
  const currentUser = user?.user;

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
        localStorage.removeItem("refreshToken");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav
      className={`${
        openMenu ? "left-0" : " left-[-300px]"
      } bg-darkBg w-[300px] text-white px-5 py-6 fixed h-full transition-all duration-500 top-0 z-50`}
    >
      <section className=" flex items-center justify-between">
        <SearchSvg />
        <button
          className=" font-medium text-3xl cursor-pointer"
          onClick={closeMenu}
        >
          &times;
        </button>
      </section>
      <section>
        <div>Sign In</div>
        <div>Newsletter</div>
        {currentUser && (
          <div onClick={handleLogout} className=" cursor-pointer">
            Logout
          </div>
        )}
      </section>
    </nav>
  );
};

export default Navbar;

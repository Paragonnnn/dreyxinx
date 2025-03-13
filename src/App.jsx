import { useState, useContext } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import Story from "./components/Story";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Stories from "./components/Stories";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "./context.jsx";
import Profile from "./components/Profile.jsx";
import Bookmarks from "./components/Bookmarks.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotAuthorized from "./components/NotAuthorized.jsx";
import { userContext } from "./context";
import AddStory from "./components/AddStory.jsx";
import TextEditor from "./components/TextEditor.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import DropDown from "./components/DropDown.jsx";

function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [SignInOrSignUp, setSignInOrSignUp] = useState("signIn");
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const { user } = useContext(userContext);
  const currentUser = user?.user;

  const clickOverlay = () => {
    setOpenMenu(false);
    setOpenSignIn(false);
    setToggleDropDown(false);
  };

  return (
    <>
      <Header
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        openSignIn={openSignIn}
        setOpenSignIn={setOpenSignIn}
        toggleDropDown={toggleDropDown}
        setToggleDropDown={setToggleDropDown}
      />
      <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <div
        className={`${
          openMenu || openSignIn || toggleDropDown ? "block" : "hidden"
        } fixed w-full h-full z-30 top-0 overlay`}
        onClick={clickOverlay}
      ></div>
      <DropDown
        toggleDropDown={toggleDropDown}
        setToggleDropDown={setToggleDropDown}
      />

      <ToastContainer />

      {openSignIn && SignInOrSignUp === "signIn" && (
        <SignIn
          setOpenSignIn={setOpenSignIn}
          setSignInOrSignUp={setSignInOrSignUp}
        />
      )}

      {openSignIn && SignInOrSignUp === "signUp" && (
        <SignUp
          setOpenSignIn={setOpenSignIn}
          setSignInOrSignUp={setSignInOrSignUp}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<Stories openMenu={openMenu} openSignIn={openSignIn} />}
        />
        {/* <Route path="/sign-in" element={<SignIn />} /> */}

        <Route
          path="/:id/:title"
          element={<Story openMenu={openMenu} openSignIn={openSignIn} />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookmark" element={<Bookmarks />} />
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["author"]}
              userRole={currentUser?.role}
            />
          }
        >
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/dashboard/add-story" element={<AddStory />} />
          <Route path="/dashboard/editor" element={<TextEditor />} />
        </Route>
        <Route
          element={
            <AdminProtectedRoute
              allowedRole={["admin"]}
              userRole={currentUser?.role}
            />
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="not-authorized" element={<NotAuthorized />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

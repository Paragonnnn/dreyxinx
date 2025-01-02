import { useState } from "react";
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

function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [SignInOrSignUp, setSignInOrSignUp] = useState("signUp");

  const clickOverlay = () => {
    setOpenMenu(false);
    setOpenSignIn(false);
  };

  return (
    <UserContextProvider>
      <Header
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        openSignIn={openSignIn}
        setOpenSignIn={setOpenSignIn}
      />
      <Navbar openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <div
        className={`${
          openMenu || openSignIn ? "block" : "hidden"
        } fixed w-full h-full z-30 top-0 overlay`}
        onClick={clickOverlay}
      ></div>

      <ToastContainer />

      {openSignIn && (SignInOrSignUp === "signIn") && (
        <SignIn setOpenSignIn={setOpenSignIn} setSignInOrSignUp={setSignInOrSignUp} />
      )}

      {
        openSignIn && (SignInOrSignUp === "signUp") && (
          <SignUp setOpenSignIn={setOpenSignIn} setSignInOrSignUp={setSignInOrSignUp} />
        )
      }



      <Routes>
        <Route
          path="/"
          element={<Stories openMenu={openMenu} openSignIn={openSignIn} />}
        />
        {/* <Route path="/sign-in" element={<SignIn />} /> */}

        <Route path="/:id/:title" element={<Story openMenu={openMenu} openSignIn={openSignIn}/>} />
      </Routes>
      <Footer />
    </UserContextProvider>
  );
}

export default App;

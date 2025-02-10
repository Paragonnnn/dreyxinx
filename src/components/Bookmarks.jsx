import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { userContext } from "../context";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  const { user } = useContext(userContext);
  const currentUser = user?.user;

  useEffect(() => {
    const getBookmarks = async () => {
      if (currentUser) {
        try {
          const response = await api.get(
            `/user/get-bookmarks/${currentUser._id}`
          );
          console.log(response.data);
          setBookmarks(response.data.bookmarks);
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    getBookmarks();
  }, [currentUser]);
  return (
    <div>
      <h1>Bookmarks</h1>
      <section>
        {bookmarks?.map((bookmark) => (
          <div>
            <img src={`${bookmark.cover_image || "https://res.cloudinary.com/drxjxycnn/image/upload/v1738676418/stories/tupac.jpg"}`} alt="" className=" h-10 w-10"/>
            <div>{bookmark.title}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Bookmarks;

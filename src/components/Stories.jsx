import React, { useEffect, useState } from "react";
import { data, story } from "../data";
import { Link } from "react-router-dom";
import { FaCommentDots, FaHeart } from "react-icons/fa";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { formatDate, reduceContentLenght } from "../tools";
import api from "../api";
import { MdError } from "react-icons/md";
import { LuLoader2 } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import SearchSvg from "../assets/Search";

const Stories = ({ openMenu, openSignIn }) => {
  const [stories, setStories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // useEffect(() => {
  //   const fetchStories = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         "http://localhost:2007/api/story/get-stories?page=1&limit=20"
  //       );
  //       const data = await response.json();
  //       console.log(data);

  //       setStories(data);
  //     } catch (error) {
  //       setError(error.message);
  //       console.log(error.message);
  //     }
  //   };
  //   fetchStories();
  // }, []);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await api.get("/story/get-stories", {
          params: { page: page, limit: 12 },
        });
        console.table(response);
        setStories(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStories();
  }, [page]);

  return (
    <div
      className={`${
        openMenu || openSignIn ? "blur-sm" : "blur-none"
      } max-w-[1440px] m-auto px-3 sm:px-5 md:px-8 lg:px-10`}
    >
      <div className=" mt-5 mb-2 flex justify-between items-center">
        <div className="flex gap-4">
          <div className=" px-3 rounded-full text-[10px] text-center cursor-pointer hover:text-white py-[4px] hover:bg-darkBg border border-solid border-darkBg transition-colors duration-300">
            All
          </div>
          <div className=" px-3 rounded-full text-xs text-center cursor-pointer hover:text-white py-[4px] hover:bg-darkBg border border-solid border-darkBg transition-colors duration-300">
            Fantasy
          </div>
          <div className=" px-3 rounded-full text-xs text-center cursor-pointer hover:text-white py-[4px] hover:bg-darkBg border border-solid border-darkBg transition-colors duration-300">
            Story
          </div>
        </div>
        <div className=" flex items-center gap-2 outline-1 outline-gray-400 rounded-md p-2 outline">
          <SearchSvg style={`h-4 stroke-black`} />
          <input placeholder="Search for story" className="outline-none" />
        </div>
      </div>
      {loading && (
        <div className=" flex flex-col justify-center items-center text-[50px]">
          <LuLoader2 className=" animate-spin " />
          <div>Loading</div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2">
          <MdError />
          <div>{error}</div>
        </div>
      )}

      {stories && !loading && !error && (
        <div className=" bg-darkBg bg-opacity-5 rounded-md p-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          {stories?.data.map((story, index) => {
            return (
              <div className=" mb-4 p-2 sm:p-4" key={story._id}>
                <div
                  className={` rounded-md outline-dotted outline-1 outline-darkBg flex flex-col items-center mb-4 relative`}
                >
                  <img
                    src={`${
                      story.cover_image ||
                      "https://res.cloudinary.com/drxjxycnn/image/upload/v1738676418/stories/tupac.jpg"
                    }`}
                    alt=""
                    className=" w-full h-[200px] object-cover rounded-md"
                  />

                  <Link
                    to={`/${story._id}/${story.title
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className=" font-semibold text-xl my-2 z-20"
                  >
                    {story.title}
                  </Link>
                  <div className=" flex-row justify-center gap-3 font-medium items-center sm:flex z-20">
                    <div className=" flex items-center gap-2 justify-center">
                      {/* <BsFillCalendarDateFill /> */}
                      <div>{formatDate(story.createdAt)}</div>
                    </div>
                    {/* <div className=" bg-darkBg h-[2px] w-[2px] rounded-full sm:block hidden"></div> */}
                    <div className=" flex sm:gap-3 gap-2 items-center">
                      {/* <div className=" flex items-center gap-2 justify-center">
                        <FaCommentDots />
                        <div>
                          {story.comments_count > 0
                            ? story.comments_count
                            : "No"}{" "}
                          {story.comments_count == "1" ? "comment" : "comments"}
                        </div>
                      </div> */}
                      <div className=" bg-darkBg h-[2px] w-[2px] rounded-full"></div>

                      <div className=" flex items-center gap-2 justify-center">
                        {/* <FaHeart /> */}
                        <div>
                          {story.likes_count}{" "}
                          {story.likes_count == "1" ? "like" : "likes"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {" "}
                  {story.category.length > 0 ? (
                    <div className=" flex gap-2 z-20">
                      {story.category.map((category, index) => (
                        <div
                          key={index}
                          className=" rounded-md text-darkBg outline outline-1 outline-darkBg w-fit px-2  text-[8px]"
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className=" rounded-md text-darkBg outline outline-1 outline-darkBg w-fit px-2  z-20 text-[8px]">
                      Uncategorized
                    </div>
                  )}
                </div>
                <div>{reduceContentLenght(story.content, 50)}</div>
                {/* <div>{story.post.readingTime}</div> */}
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-between items-center mt-5">
        {stories && !loading && !error && (
          <div className={` flex justify-center items-center`}>
            <div
              className={`${
                stories.previous
                  ? "cursor-pointer"
                  : " hidden"
              } bg-darkBg text-white rounded-md px-3 py-2 `}
              onClick={() => stories.previous && setPage(page - 1)}
            >
              Previous Page
            </div>
          </div>
        )}
        {stories && !loading && !error && (
          <div className=" flex justify-center items-center ">
            <div
              className={`${
                stories.next
                  ? "cursor-pointer"
                  : " hidden"
              } bg-darkBg text-white rounded-md px-3 py-2`}
              onClick={() => stories.next && setPage(page + 1)}
            >
              Next Page
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;

import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { LuLoader2 } from "react-icons/lu";
import { formatDate } from "../tools";
import api from "../api";
import { toast } from "react-toastify";
import { userContext } from "../context";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Comment from "./Comment";
import { FaRegHeart, FaShare } from "react-icons/fa";

const Story = ({ openMenu, openSignIn }) => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [commentData, setCommentData] = useState({
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteBtn, setShowDeleteBtn] = useState(null);
  const { user } = useContext(userContext);
  const currentUser = user?.user;
  const deleteBtnRef = useRef(null);
  const [likePosition, setLikePosition] = useState({ x: 0, y: 0 });
  const [showLike, setShowLike] = useState(false);
  const [openReply, setOpenReply] = useState(false);

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await api.get(`/story/get-story/${id}`);
        setStory(response.data.data);
        setLoading(false);
        console.log(response.data.data);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  //   useEffect(() => {
  //     const handleClickOutside = (e) => {
  //         if (deleteBtnRef.current && !deleteBtnRef.current.contains(e.target)) {
  //             setShowDeleteBtn(false);
  //         }
  //     };

  //     window.addEventListener("click", handleClickOutside);
  //     return () => {
  //         window.removeEventListener("click", handleClickOutside);
  //         console.log("removed");
  //     };
  // }, []);

  const checkIfLiked = () => {
    if (currentUser) {
      if (
        story?.likes?.find((likedUser) => likedUser.user_id === currentUser._id)
      ) {
        return true;
      }
    }
    return false;
  };

  const likeElement = document.getElementById("like");

  const likeStory = async (e) => {
    if (!currentUser) {
      toast.error("Please sign in to like a story", {
        theme: "dark",
      });
      return;
    }
    if (liking) return;
    setLiking(true);

    if (checkIfLiked()) {
      likeElement.style.color = "#f5deb3";
      setStory((prev) => ({
        ...prev,
        likes: prev.likes.filter(
          (likedUser) => likedUser.user_id !== currentUser._id
        ),
        likes_count: prev.likes_count - 1,
      }));
    } else {
      likeElement.style.color = "red";
      setStory((prev) => ({
        ...prev,
        likes: [...prev.likes, { user_id: currentUser._id }],
        likes_count: prev.likes_count + 1,
      }));
    }

    try {
      const response = await api.post(`/story/like-story/${id}`, {
        story_id: id,
        user_id: currentUser._id,
      });
      console.log(response.data);
      setLiking(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        theme: "dark",
      });
    } finally {
      setLiking(false);
    }
  };

  const doubleClickToLike = (e) => {
    const bigLike =  document.getElementById("bigLike");
    setLikePosition({
      x: e.pageX - +window.getComputedStyle(bigLike).width.slice(0, -2) / 2,
      y: e.pageY - +window.getComputedStyle(bigLike).height.slice(0, -2) / 2,
    });
    setShowLike(true);
    setTimeout(() => {
      setShowLike(false);
    }, 1000);
    if (!checkIfLiked()) {
      likeStory(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentData({ ...commentData, [name]: value });
    console.log(commentData);
  };

  const handleSendComment = async () => {
    if (!currentUser) {
      toast.error("Please sign in to comment on a story", {
        theme: "dark",
      });
      return;
    }
    if (sendingComment) return;
    setSendingComment(true);
    try {
      const response = await api.post(`/story/add-comment/${id}`, {
        ...commentData,
        story_id: id,
        user_id: currentUser._id,
        user_name: currentUser.username,
      });
      console.log(response.data.data.comments);
      setCommentData({ ...commentData, content: "" });
      toast.success("Comment sent successfully", {
        theme: "dark",
      });
      setStory((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            ...response.data.data.comments[
              response.data.data.comments.length - 1
            ],
          },
        ],
        comments_count: prev.comments_count + 1,
      }));
      setSendingComment(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        theme: "dark",
      });
      setSendingComment(false);
    }
  };

  const toggleDeleteBtn = (index) => {
    console.log(deleteBtnRef);
    setShowDeleteBtn(showDeleteBtn === index ? false : index);
  };

  const deleteComment = async (index) => {
    if (!currentUser) {
      toast.error("Please sign in to delete a comment", {
        theme: "dark",
      });
      return;
    }
    if (deletingComment) return;
    setDeletingComment(true);
    try {
      const response = await api.delete(
        `/story/delete-comment/${id}/${story.comments[index]._id}`
      );
      console.log(response.data);
      setStory((prev) => ({
        ...prev,
        comments: prev.comments.filter(
          (comment) => comment._id !== story.comments[index]._id
        ),
        comments_count: prev.comments_count - 1,
      }));
      toast.success(response.data.message, {
        theme: "dark",
      });
      setDeletingComment(false);
      setShowDeleteBtn(false);
      setOpenReply(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        theme: "dark",
      });
      setDeletingComment(false);
    }
  };

  return (
    <div
      className={`${
        openMenu || openSignIn ? "blur-sm" : "blur-none"
      } max-w-[1440px] m-auto px-1 sm:px-3 md:px-5 lg:px-7 mt-2`}
    >
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
      {story && !loading && !error && (
        <section className=" py-3 md:px-7 px-3 md:py-7 bg-gray-500 bg-opacity-5">
          <section
            className="  flex items-center flex-col py-5 bg-darkBg bg-opacity-10 rounded-md relative"
            style={{
              backgroundImage: `url(${story?.cover_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {story.cover_image && (
              <div className="  absolute inset-0 bg-white opacity-40 z-[5]"></div>
            )}
            <div className=" z-20">
              {story?.category.length > 0 ? (
                <div className=" flex gap-2 z-20">
                  {story?.category.map((category, index) => (
                    <div
                      key={index}
                      className=" rounded bg-darkBg text-white w-fit px-2"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div className=" rounded bg-darkBg text-white w-fit px-2 z-20">
                  Uncategorized
                </div>
              )}
            </div>
            <div className=" text-2xl font-bold my-3 z-20">{story?.title}</div>
            <div className="flex items-center gap-2 z-20">
              <div>{formatDate(story?.createdAt)}</div>
              <div className=" bg-darkBg h-[2px] w-[2px] rounded-full "></div>

              <a className="" href="#comments">
                {story?.comments_count > 0 ? story?.comments_count : "No"}{" "}
                comments
              </a>
            </div>
          </section>
          <section
            className=" rounded-sm mt-4 text-lg shadow-content p-3 bg-paperBrown select-none overflow-hidden"
            onDoubleClick={(e) => doubleClickToLike(e)}
          >
            <div className=" font-sans">{story?.content}</div>
            <FaHeart
              className={`${
                showLike ? "block animate-like" : "hidden"
              } absolute text-9xl text-red-500`}

              id="bigLike"
              style={{
                left: `${likePosition.x}`,
                top: `${likePosition.y}`,
              }}
            />
            <div className="flex items-center mt-4">
              <div className=" w-fit p-1 relative">
                <FaHeart
                  id="like"
                  className={`cursor-pointer text-lg ${
                    checkIfLiked() ? "animate-pulsate" : ""
                  }`}
                  onClick={(e) => likeStory(e)}
                  style={{ color: checkIfLiked() ? "red" : "#f5deb3" }}
                />
                <FaRegHeart
                  className={`${
                    checkIfLiked() ? "animate-pulsate" : ""
                  } absolute top-[2px] text-xl left-[3px] cursor-pointer`}
                  onClick={(e) => likeStory(e)}
                />
              </div>
              <div className=" text-xs">{story?.likes_count}</div>
            </div>
          </section>
        </section>
      )}
      <section id="comments" className=" mb-12"></section>
      <Comment
        commentData={commentData}
        handleInputChange={handleInputChange}
        handleSendComment={handleSendComment}
        sendingComment={sendingComment}
        story={story}
        setStory={setStory}
        currentUser={currentUser}
        toggleDeleteBtn={toggleDeleteBtn}
        showDeleteBtn={showDeleteBtn}
        deleteComment={deleteComment}
        deletingComment={deletingComment}
        timeAgo={timeAgo}
        setOpenReply={setOpenReply}
        openReply={openReply}
      />
    </div>
  );
};

export default Story;

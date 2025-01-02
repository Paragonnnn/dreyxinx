import React, { useState } from "react";
import { capitalizeFirstLetter } from "../tools";
import { BsThreeDotsVertical } from "react-icons/bs";
import api from "../api";
import { toast } from "react-toastify";

const Comment = ({
  story,
  setStory,
  handleInputChange,
  commentData,
  handleSendComment,
  sendingComment,
  deleteComment,
  showDeleteBtn,
  toggleDeleteBtn,
  deleteBtnRef,
  currentUser,
  timeAgo,
  openReply,
  setOpenReply,
}) => {
  const [replyComment, setReplyComment] = useState("");
  const [taggedUser, setTaggedUser] = useState("");

  const showReplyInput = (index, username) => {
    setOpenReply(index);
    setTaggedUser(`@${username}`);
    setReplyComment(`@${username}`);
  };

  const handleReplyChange = (e) => {
    const inputValue = e.target.value;
    // Ensure the tagged username remains intact
    if (inputValue.startsWith(taggedUser)) {
      setReplyComment(inputValue);
    }
  };

  const sendReply = async (index) => {
    if (!currentUser) {
      toast.error("Please sign in to reply to comments", {
        theme: "dark",
      });
      return;
    }

    // console.log(story._id, story.comments[index]._id);

    try {
      const response = await api.post(
        `/story/reply-comment/${story._id}/${story.comments[index]._id}`,
        {
          content: replyComment,
          user_id: currentUser._id,
          user_name: currentUser.username,
        }
      );
      console.log(response.data);
      setReplyComment("");
      // setOpenReply(false);

      setTaggedUser("");
      setStory((prev) => {
        const updatedComments = [...prev.comments];
        const updatedComment = {
          ...updatedComments[index],
          replies: [
            ...updatedComments[index].replies,
            response.data.data.comments[index].replies[
              response.data.data.comments[index].replies.length - 1
            ],
          ],
        };
        updatedComments[index] = updatedComment;
        return { ...prev, comments: updatedComments };
      });

      toast.success("Reply sent successfully", {
        theme: "dark",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <section className=" divide-y divide-gray-200">
        {story?.comments.map((comment, index) => (
          <div key={comment._id} className=" flex gap-4 py-2">
            <div className="bg-[#f8f3ef] text-3xl w-10 h-10 flex justify-center items-center rounded-full text-[#c8a079] flex-shrink-0">
              {comment.user_name[0].toUpperCase()}
            </div>
            <div className=" flex justify-between w-full">
              <div>
                <div>
                  <div className=" font-extrabold">
                    {capitalizeFirstLetter(comment.user_name)}
                  </div>
                  <div>{comment.content}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className=" text-[8px] text-[#c8a079]">
                    {timeAgo
                      .format(new Date(comment.createdAt || Date.now()))
                      .replace("minutes", "mins")
                      .replace("minute", "min")
                      .replace("hour", "hr")
                      .replace("hours", "hrs")}
                  </div>
                  <button
                    className=" text-[8px] cursor-pointer"
                    onClick={() => showReplyInput(index, comment.user_name)}
                  >
                    Reply
                  </button>
                </div>
                <div>
                  {comment.replies.map((reply, index) => (
                    <div key={reply._id} className="flex gap-2">
                      <div className="text-[#c8a079] bg-[#f8f3ef] h-6 w-6 flex justify-center items-center rounded-full">
                        {reply.user_name[0].toUpperCase()}
                      </div>
                      <div>
                        <div>{capitalizeFirstLetter(reply.user_name)}</div>
                        <div>{reply.content}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {openReply === index && (
                  <div>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Enter your reply..."
                      onChange={(e) => {
                        handleReplyChange(e);
                      }}
                      value={replyComment}
                    />
                    <button onClick={() => sendReply(index)}>Send Reply</button>
                  </div>
                )}
              </div>

              {currentUser && currentUser._id === comment.user_id && (
                <div className=" relative">
                  <div
                    className="  w-5 z-10 h-5 rounded-full relative flex justify-center items-center bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      toggleDeleteBtn(index);
                    }}
                  >
                    <BsThreeDotsVertical
                      className=" cursor-pointer flex justify-end flex-shrink-0 z-0 "
                      ref={deleteBtnRef}
                    />
                  </div>

                  <button
                    className={`${
                      showDeleteBtn === index ? "block" : "hidden"
                    } absolute right-2 top-4 bg-darkBg px-2 py-1 text-white rounded-sm animate-deleteBtn`}
                    ref={deleteBtnRef}
                    onClick={() => deleteComment(index)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      <div className=" flex flex-col my-5 gap-1">
        <label htmlFor="content">Enjoyed this? Drop a comment</label>
        <textarea
          type="text"
          name="content"
          placeholder="Write your comment here..."
          className=" p-1 min-h-20 max-h-48 outline-none border border-solid border-gray-400 rounded-sm"
          onChange={handleInputChange}
          value={commentData.content}
          required
        />
        {/* <label htmlFor="user_name">Name</label>
          <input type="text" className="outline-none border border-solid border-gray-400 rounded-sm p-1" placeholder="Enter your name here" name="user_name" onChange={handleInputChange} value={commentData.user_name} required/> */}
        <button
          className={`${
            sendingComment ? "opacity-80 cursor-not-allowed" : ""
          } w-fit bg-black text-white px-3 py-1 rounded-sm mt-2`}
          onClick={handleSendComment}
        >
          Send your Comment
        </button>
      </div>
    </section>
  );
};

export default Comment;

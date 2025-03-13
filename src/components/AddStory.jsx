import React, { useRef, useState, useContext } from "react";
import api from "../api";
import { userContext } from "../context";

const AddStory = () => {
  const { user } = useContext(userContext);
  const currentUser = user?.user;
  const [story, setStory] = useState({
    author_id: currentUser._id,
    title: "",
    cover_image: "",
    categories: [],
    summary: "",
  });
  const [image, setImage] = useState(null);
  const coverImageRef = useRef(null);

  const addStory = async () => {
    let coverImageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("cover_image", image);
      console.log(formData.get("cover_image"));

      try {
        const response = await api.post("/story/upload-cover-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        coverImageUrl = response.data.url;
      } catch (error) {
        console.error("Image upload failed:", error);
        return; // Exit the function if image upload fails
      }
    }

    const updatedStory = {
      ...story,
      cover_image: coverImageUrl,
      categories: story.categories.filter((category) => category.length !== 0),
    };

    console.log(updatedStory);

    try {
      const response = await api.post("/story/add-story", updatedStory, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Story upload failed:", error);
    }
  };

  return (
    <div className="max-w-[1440px] m-auto px-4">
      <h2>My Stories</h2>
      <button>Add new story</button>
      <div className="bg-gray-100 p-4 rounded-md w-fit mx-auto max-w-md">
        <div className="flex flex-col items-center">
          <label htmlFor="">Title:</label>
          <input
            type="text"
            onChange={(e) => setStory({ ...story, title: e.target.value })}
            value={story.title}
          />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="">Summary:</label>
          <input
            type="text"
            onChange={(e) => setStory({ ...story, summary: e.target.value })}
            value={story.summary}
          />
        </div>
        <input
          type="file"
          className="hidden"
          ref={coverImageRef}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
          }}
        />

        <div className="flex flex-col items-center mb-4">
          <h2>Cover Image</h2>
          <img
            src={`${
              (image && URL.createObjectURL(image)) ||
              "https://res.cloudinary.com/drxjxycnn/image/upload/v1739027709/stories/logo.jpg"
            }`}
            alt=""
            onClick={() => coverImageRef.current.click()}
            className="cursor-pointer h-64"
          />
          {image && (
            <button onClick={() => setImage(null)}>Remove Image</button>
          )}
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="">Categories:</label>
          <input
            type="text"
            value={story.categories.join(",")}
            onChange={(e) => {
              const categories = e.target.value
                .split(",")
                .map((category) => category.trim());

              setStory({
                ...story,
                categories,
              });
              console.log(categories);
            }}
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {story.categories
              .filter((category) => category.length !== 0)
              .map((category, index) => (
                <span
                  key={category + index}
                  className=" px-2 rounded-md bg-blue-400"
                >
                  {category}
                </span>
              ))}
          </div>
          <span>Separate each categories with a comma ","</span>
        </div>
        <div className="flex justify-center">
          <button onClick={addStory} className="">
            Create Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStory;

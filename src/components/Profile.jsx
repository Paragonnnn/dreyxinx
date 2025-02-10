import { useState, useRef, useContext, useEffect } from "react";
import React from "react";
import api from "../api";
import { RiEdit2Fill } from "react-icons/ri";
import { userContext } from "../context";
import { toast } from "react-toastify";
import { LuLoader2 } from "react-icons/lu";
import {
  IoCloudUploadOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { FcCancel } from "react-icons/fc";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    bio: "",
    profile_picture: "",
  });
  const [usernameExists, setUsernameExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { user, setUser } = useContext(userContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.user) {
      setFormData({
        username: user.user.username || "",
        email: user.user.email || "",
        fullname: user.user.fullname || "",
        bio: user.user.bio || "",
        profile_picture: user.user.profile_picture || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      return toast.error("Please select an image to upload", {
        theme: "dark",
      });
    }
    setUploadingImage(true);

    const imageData = new FormData();
    imageData.append("image", image);

    try {
      const response = await api.post(
        "/user/upload-profile-picture",
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadedImage(response.data.url);
      setUploadingImage(false);
      console.log(response);
      setFormData((prev) => ({ ...prev, profile_picture: response.data.url }));
      toast.success("Image uploaded successfully", {
        theme: "dark",
      });
    } catch (error) {
      alert("Failed to upload image: " + error.message);
      setUploadingImage(false);
      console.log(error);
    }
  };

  const checkIfUsernameExists = async (username) => {
    if (user.user.username === username || username === "") {
      setUsernameExists(false);
      return;
    }
    try {
      const response = await api.get(`/user/username-exists/${username}`);
      console.log(response.data);
      setUsernameExists(response.data.exists);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfEmailExists = async (email) => {
    if (user.user.email === email || email === "") {
      setEmailExists(false);
      return;
    }
    try {
      const response = await api.get(`/user/email-exists/${email}`);
      console.log(response.data);
      setEmailExists(response.data.exists);
    } catch (error) {
      console.log(error);
    }
  };

  const changesAvailable = () => {
    if (
      formData.username !== user.user.username ||
      formData.email !== user.user.email ||
      formData.fullname !== user.user.fullname ||
      formData.bio !== user.user.bio ||
      formData.profile_picture !== user.user.profile_picture
    ) {
      return true;
    }
    return false;
  };
  const saveChanges = async () => {
    setSaving(true);
    try {
      if (changesAvailable()) {
        const response = await api.put(
          `/user/update-user/${user.user._id}`,
          formData
        );
        console.log(response.data);
        setSaving(false);
        setUser({ user: response.data });
        setImage(null);
        toast.success("Profile updated successfully", {
          theme: "dark",
        });
      } else {
        setSaving(false);
        toast.error("No changes made", {
          theme: "dark",
        });
      }
    } catch (error) {
      console.log(error);
      setSaving(false);
      if (error.response) {
        toast.error(error.response.data.message, {
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          theme: "dark",
        });
      }
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto mt-3 px-2">
      {user ? (
        <div className="flex justify-center flex-col items-center gap-4">
          <div className="relative">
            <div className="flex justify-center gap-4 h-fit rounded-full items-center overflow-hidden w-fit">
              <img
                src={
                  uploadedImage
                    ? uploadedImage
                    : formData.profile_picture ||
                      "https://res.cloudinary.com/drxjxycnn/image/upload/v1738684543/stories/avatar.jpg"
                }
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
            <RiEdit2Fill
              className="text-xl absolute bottom-[-5px] right-[-5px] cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {uploadingImage ? (
            <div className=" px-4 bg-blue-500  text-white py-1 rounded  mb-4 flex items-center justify-center gap-1 cursor-not-allowed">
              <LuLoader2 className=" animate-spin text-md font-semibold" />
              Uploading...
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-3 py-1 rounded flex gap-2 items-center hover:bg-blue-600"
            >
              <IoCloudUploadOutline className="h-4 w-4" />
              Upload
            </button>
          )}
          <div className="flex flex-col bg-gray-100 p-4 rounded-md w-full max-w-md">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => {
                handleInputChange(e);
                checkIfUsernameExists(e.target.value);
              }}
              className="bg-gray-200 px-2 py-1 rounded w-full"
            />
            {usernameExists ? (
              <div className=" text-red-600 flex gap-1 items-center">
                <FcCancel /> Username already exist
              </div>
            ) : formData.username.trim() === user.user.username ? (
              <></>
            ) : formData.username.trim() === "" ? (
              <div className=" text-red-600">Enter username</div>
            ) : (
              <div className="flex text-green-600 items-center gap-1">
                <IoCheckmarkCircleOutline className=" " />
                {formData.username} is available{" "}
              </div>
            )}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleInputChange(e);
                checkIfEmailExists(e.target.value);
              }}
              className="bg-gray-200 px-2 py-1 rounded w-full"
            />
            {emailExists ? (
              <div className=" text-red-600 flex gap-1 items-center">
                <FcCancel /> Email already exist
              </div>
            ) : formData.email.trim() === user.user.email ? (
              <></>
            ) : formData.email.trim() === "" ? (
              <div className=" text-red-600">Enter email</div>
            ) : (
              <></>
            )}

            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              className="bg-gray-200 px-2 py-1 rounded w-full"
            />

            <label htmlFor="bio">Bio</label>
            <textarea
              name="bio"
              cols="30"
              rows="3"
              value={formData.bio}
              onChange={handleInputChange}
              className="bg-gray-200 px-2 py-1 rounded w-full"
            ></textarea>
          </div>
          {saving ? (
            <div className=" w-[150px] bg-blue-500 text-xl text-white py-1 rounded font-semibold mb-4 flex items-center justify-center">
              <LuLoader2 className=" animate-spin " />
            </div>
          ) : (
            <button
              onClick={saveChanges}
              className={`${
                changesAvailable()
                  ? "bg-opacity-100 hover:bg-blue-600"
                  : "bg-opacity-50 cursor-not-allowed"
              } bg-blue-500 text-white px-3 py-1 rounded w-[150px] `}
            >
              Save Changes
            </button>
          )}
        </div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
};

export default Profile;

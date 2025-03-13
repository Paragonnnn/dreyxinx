import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { userContext } from "../context";

const Dashboard = () => {
  const { id } = useParams();
  const { user } = useContext(userContext);
  const [authorStories, setAuthorStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      if (id) {
        try {
          const response = await api.get(`/story/get-stories-by-author/${id}`);
          console.log(response.data.data);
          setAuthorStories(response.data.data);
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    fetchStories();
  }, [id]);

  return (
    <div className="max-w-[1440px] m-auto px-4">
      <h2>My Stories</h2>
      <ul>
        {authorStories?.map((story) => (
          <li key={story._id}>{story.title}</li>
        ))}
      </ul>
      <Link to={`/dashboard/add-story`}>Add story</Link>
      <Link to={`/dashboard/editor`}>Add Chapters</Link>
    </div>
  );
};

export default Dashboard;

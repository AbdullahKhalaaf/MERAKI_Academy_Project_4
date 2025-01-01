import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext } from "react";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { setToken, token, setIsLoggedIn } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);

  const handleAuthorClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  const handleEditClick = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div>
      <h2>Home Page</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div>
              <img src={post.author?.avatar} alt={post.author?.avatar} />
              <span
                onClick={() => handleAuthorClick(post.author._id)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {post.author?.userName}
              </span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div>
              <span>{post.likes?.length} Likes</span>
            </div>
            <div>
              {post.author._id === token?._id && (
                <button
                  onClick={() => handleEditClick(post._id)}
                 
                >
                  Edit Post
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
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

  // const handleEditClick = (postId) => {
  //   navigate(`/${postId}`);
  // };
  const decodeToken = jwtDecode(token);

  const handleCreatePostClick = () => {
    axios
      .post(
        "http://localhost:5000/posts/create",
        { content, author: decodeToken.userId },
        {
          headers: {
            Authoraization: `brear${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Post Created ");
        setUserId(decodeToken.userId);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        console.log("userid form token", decodeToken.userId);
      });
  };

  return (
    <div>
      <h2>Home Page</h2>
      <div>
        <textarea
          placeholder="Create a new post"
          type="text"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <button onClick={handleCreatePostClick}>Post</button>
      </div>
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
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default HomePage;

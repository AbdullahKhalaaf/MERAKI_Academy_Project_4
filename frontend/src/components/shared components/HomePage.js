import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

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
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        axios
          .get(`http://localhost:5000/comments/get/${post._id}`)
          .then((response) => {
            console.log(response);
            setComments((prevComments) => [
              ...prevComments,
              { postId: post._id, comments: response.data.comments },
            ]);
          })
          .catch((err) => {
            console.log("Error fetching comments:", err);
          });
      });
    }
  }, [posts]);

  const handleAuthorClick = (authorId) => {
    navigate(`/profile/${authorId}`);
  };

  const handleLikeClick = (postId, userId, isLiked) => {
    if (isLiked) {
      axios
        .delete(`http://localhost:5000/likes/deleteLike/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { postId, userId },
        })
        .then((result) => {
          console.log("Unlike result", result);

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, likes: post.likes.filter((id) => id !== userId) }
                : post
            )
          );
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      axios
        .post(
          `http://localhost:5000/likes/${postId}/newLike`,
          { postId, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((result) => {
          console.log("Like result", result);

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, likes: [...post.likes, userId] }
                : post
            )
          );
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  };

  const decodeToken = jwtDecode(token);
  const newPost = { content, author: decodeToken.userId };
  const handleCreatePostClick = () => {
    axios
      .post(
        "http://localhost:5000/posts/create",
        { content, author: decodeToken.userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const createdPost = response.data.post;
        console.log(response);

        setPosts([createdPost, ...posts]);
        navigate("/home");

        console.log(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h2>Home Page</h2>
      <div>
        <textarea
          placeholder="Create a new post"
          type="text"
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleCreatePostClick}>Post</button>
      </div>
      {posts.length > 0 ? (
  posts.map((post) => {
    const isLiked = post.likes.includes(decodeToken.userId);
    console.log("post", post);

    return (
      <div
        key={post._id}
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <div>
          <img src={post.avatar} alt={post.avatar} />
          <span
            onClick={() => navigate(`/profile/${post.author._id}`)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {post.author?.userName}
          </span>
        </div>

        <p>{post.content}</p>

        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment, index) => (
            <div key={index}>
              <p>
                <strong>{comment.commenter?.userName}</strong>: {comment.comment}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}

        <div>
          <span>{post.likes.length} Likes</span>
          <span></span>
          <span>
            <button
              onClick={() =>
                handleLikeClick(post._id, decodeToken.userId, isLiked)
              }
            >
              {isLiked ? "Unlike" : "Like"}
            </button>
          </span>
        </div>
      </div>
    );
  })
) : (
  <p>No posts available.</p>
)}
    </div>
  );
};

export default HomePage;

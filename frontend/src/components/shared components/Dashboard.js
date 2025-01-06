import React, { useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Button } from "react-bootstrap";

const Dashboard = () => {
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 
    const [comment, setComment] = useState("");
  

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${userId}`)
      .then((response) => {
        setUser(response.data.user);
        return axios.get(`http://localhost:5000/posts/user/${userId}`);
      })
      .then((response) => {
        setPosts(response.data.post);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);
  const handleAddComment = (postId) => {
    axios
      .post(`http://localhost:5000/comments/${postId}/addComment`, {
        postId,
        commenter: userId,
        comment,
      })
      .then((result) => {
        setComment("");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, result.data.comment] }
              : post
          )
        );
      })
      .catch((err) => {
        console.log("Error adding comment:", err);
      });
  };
  const handleLike = (postId) => {
    axios
      .post(`http://localhost:5000/likes/${postId}/newLike`, { postId, userId })
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likes: [...post.likes, { userId }] }
              : post
          )
        );
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  const handleUnlike = (postId) => {
    axios
      .delete(`http://localhost:5000/likes/deleteLike/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { postId, userId },
      })
      .then((response) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.filter((like) => like.userId !== userId),
                }
              : post
          )
        );
      })
      .catch((error) => {
        console.error("Error unliking post:", error);
      });
  };

  return (
    <div className="container mt-5">
      {user && (
        <div>
          <h2 className="text-center mb-4">{user.userName}'s Profile</h2>
          <div className="d-flex justify-content-center mb-4">
            <img
              src={user.avatar}
              alt={`${user.userName}'s avatar`}
              className="img-fluid rounded-circle"
              style={{ width: "150px" }}
            />
          </div>
          <h3 className="text-center">{user.userName}</h3>

          <div className="row mt-4">
            <div className="col-6">
              <h4>Followers:</h4>
              <ul className="list-group">
                {user.followers?.map((follower) => (
                  <li 
                    key={follower._id} 
                    className="list-group-item d-flex align-items-center" 
                    onClick={() => navigate(`/dashboard/${follower._id}`)} 
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={follower.avatar}
                      alt={`${follower.userName}'s avatar`}
                      className="img-fluid rounded-circle"
                      style={{ width: "40px", marginRight: "10px" }}
                    />
                    {follower.userName}
                  </li>
                )) || <p>No followers available.</p>}
              </ul>
            </div>

            <div className="col-6">
              <h4>Following:</h4>
              <ul className="list-group">
                {user.following?.map((following) => (
                  <li 
                    key={following._id} 
                    className="list-group-item d-flex align-items-center" 
                    onClick={() => navigate(`/dashboard/${following._id}`)} 
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={following.avatar}
                      alt={`${following.userName}'s avatar`}
                      className="img-fluid rounded-circle"
                      style={{ width: "40px", marginRight: "10px" }}
                    />
                    {following.userName}
                  </li>
                )) || <p>No following users.</p>}
              </ul>
            </div>
          </div>
                <div>
          <h3 className="mt-4">Posts by {user.userName}</h3>
            {posts?.map((post) => (
              <div key={post._id} className="list-group-item mb-3">
                <p>{post.content}</p>
                <div>
                  <span className="badge bg-primary">
                    {post.likes?.length} Likes
                  </span>
                </div>
                <div>
                  {post.comments.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <>
                        <p key={index}>
                          <strong>{comment?.commenter?.userName}</strong>:{" "}
                          {comment.comment}
                        </p>
                        {console.log("comment", comment)}
                      </>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
                <input
                  className="form-control form-control-sm"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddComment(post._id)}
                >
                  Add Comment
                </Button>

                <button
                  className={`btn ${
                    post.likes.some((like) => like.userId === userId)
                      ? "btn-danger"
                      : "btn-light"
                  } btn-sm mt-2`}
                  onClick={() => {
                    const isLiked = post.likes.some(
                      (like) => like.userId === userId
                    );
                    if (isLiked) {
                      handleUnlike(post._id);
                    } else {
                      handleLike(post._id);
                    }
                  }}
                  style={{ border: "none", backgroundColor: "transparent" }}
                >
                  <i
                    className={`bi bi-heart${
                      post.likes.some((like) => like.userId === userId)
                        ? "-fill"
                        : ""
                    }`}
                    style={{
                      fontSize: "1.5rem",
                      color: post.likes.some((like) => like.userId === userId)
                        ? "#e74c3c"
                        : "#bdc3c7",
                    }}
                  />
                </button>
              </div>
            )) || <p>No posts available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

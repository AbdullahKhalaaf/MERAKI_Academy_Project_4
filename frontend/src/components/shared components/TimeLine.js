import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import { Button } from "react-bootstrap";

const TimeLine = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [comment, setComment] = useState([]);
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        setPosts(result.data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddComment = (postId) => {
    axios
      .post(`http://localhost:5000/comments/${postId}/addComment`)
      .then((result) => {
        console.log("postId", postId);
      })
      .catch((err) => {
        console.log("postId", postId);
        console.log(err);
      });
  };

  const handleFollowUser = (followedUserId) => {
    axios
      .post("http://localhost:5000/users/follow", { followedUser: followedUserId }, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log(response.data.message);
        
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUnfollowUser = (followedUserId) => {
    axios
      .post("http://localhost:5000/users/unfollow", { followedUser: followedUserId }, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log(response.data.message);
        
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">TimeLine</h2>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={post.author.avatar}
                      alt="User Avatar"
                      className="rounded-circle"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <h5
                      onClick={() => {
                        navigate(`/dashboard/${post.author._id}`);
                      }}
                      style={{ cursor: "pointer", color: "blue" }}
                      className="ms-3 mb-0"
                    >
                      {post.author.userName}
                    </h5>
                   
                    {post.author._id !== userId && (
                      <div>
                        <Button
                          variant="primary"
                          onClick={() => handleFollowUser(post.author._id)}
                        >
                          Follow
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleUnfollowUser(post.author._id)}
                        >
                          Unfollow
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="card-text">{post.content}</p>
                </div>

                <div className="card-footer text-muted mt-2">
                  <small>
                    {post.comments.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <p key={index}>
                          <strong>{comment.commenter.userName}</strong>
                          <br />
                          {comment.comment}
                        </p>
                      ))
                    ) : (
                      <small>No comments</small>
                    )}
                  </small>
                  <input
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleAddComment(post._id);
                    }}
                  >
                    Add comment
                  </button>
                </div>
                <span>{post.likes.length} Likes</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default TimeLine;

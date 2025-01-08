import React, { useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../App";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Row, Form, Spinner } from "react-bootstrap";

const DashboardAnotherUser = () => {
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((response) => {
        setUser(response.data.user);
        setIsFollowed(
          response.data.user.followers.some(
            (follower) => follower._id === userId
          )
        );
        return axios.get(`http://localhost:5000/posts/user/${id}`);
      })
      .then((response) => {
        setPosts(response.data.post);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, userId]);

  const handleNavigate = (userId) => {
    navigate(`/dashboard/${userId}`);
  };
  const handleDeleteComment = (commentId, postId) => {
    axios
      .delete(`http://localhost:5000/comments/${commentId}`)
      .then((response) => {
        console.log("comment Deleted Successfuly:", response);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment._id !== commentId
                  ),
                }
              : post
          )
        );
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleFollowUser = () => {
    axios
      .post(
        "http://localhost:5000/users/follow",
        { followedUser: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsFollowed(true);
        axios
          .get(`http://localhost:5000/users/${id}`)
          .then((updatedResponse) => {
            setUser(updatedResponse.data.user);
          })
          .catch((error) => {
            console.error("Error fetching updated user:", error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUnfollowUser = () => {
    axios
      .post(
        "http://localhost:5000/users/unfollow",
        { followedUser: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsFollowed(false);
        axios
          .get(`http://localhost:5000/users/${id}`)
          .then((updatedResponse) => {
            setUser(updatedResponse.data.user);
          })
          .catch((error) => {
            console.error("Error fetching updated user:", error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:5000/posts/deletePost/${postId}`)
      .then((response) => {
        console.log("post Deleted", response);
        setPosts((prevPosts) => {
          prevPosts.filter((post) => post._id !== postId);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      <h3
        className="text-center"
        onClick={() => handleNavigate(user._id)}
        style={{ cursor: "pointer", color: "blue" }}
      >
        {user.userName}
      </h3>
      {user && (
        <div>
          <h2 className="text-center mb-4">{user.userName}'s Profile</h2>
          <div className="d-flex justify-content-center mb-4">
            <img
              src={user.avatar}
              alt={`${user.userName}'s avatar`}
              className="img-fluid rounded-circle"
              style={{ width: "150px", cursor: "pointer" }}
              onClick={() => handleNavigate(user._id)}
            />
          </div>

          {userId !== id && (
            <div className="d-flex justify-content-center my-3">
              <Button
                variant={isFollowed ? "danger" : "primary"}
                onClick={isFollowed ? handleUnfollowUser : handleFollowUser}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </Button>
            </div>
          )}

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

            <div className="row mt-4">
              <h3 className="mt-4">Posts by {user.userName}</h3>
              {posts?.map((post, index) => (
                <Col key={index} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
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
                          style={{ cursor: "pointer", color: "#007bff" }}
                          className="ms-3 mb-0"
                        >
                          {post.author.userName}
                        </h5>
                        <Button
                          variant="danger"
                          onClick={() => {
                            handleDeletePost(post._id);
                          }}
                        >
                          Delete Post
                        </Button>
                      </div>

                      <p className="card-text">{post.content}</p>

                      <div className="post-images mb-3">
                        {post.images && post.images?.length > 0 ? (
                          post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post Image ${index + 1}`}
                              className="img-fluid mb-2"
                              style={{
                                maxHeight: "200px",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ))
                        ) : (
                          <small></small>
                        )}
                      </div>
                    </Card.Body>

                    <Card.Footer className="text-muted">
                      <div className="d-flex justify-content-between">
                        <small>
                          {post.comments.length > 0 ? (
                            post.comments.map((comment, index) => (
                              <>
                                <p key={index}>
                                  <strong
                                    style={{
                                      cursor: "pointer",
                                      color: "#007bff",
                                    }}
                                    onClick={() => {
                                      navigate(
                                        `/dashboard/${comment.commenter._id}`
                                      );
                                    }}
                                  >
                                    {comment?.commenter?.userName}
                                  </strong>
                                  <br />

                                  {comment?.comment}
                                </p>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() =>
                                    handleDeleteComment(comment._id, post._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </>
                            ))
                          ) : (
                            <small>No comments</small>
                          )}
                        </small>
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
                          style={{
                            border: "none",
                            backgroundColor: "transparent",
                          }}
                        >
                          <i
                            className={`bi bi-heart${
                              post.likes.some((like) => like.userId === userId)
                                ? "-fill"
                                : ""
                            }`}
                            style={{
                              fontSize: "1.5rem",
                              color: post.likes.some(
                                (like) => like.userId === userId
                              )
                                ? "#e74c3c"
                                : "#bdc3c7",
                            }}
                          />
                        </button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              )) || <p>No posts available.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAnotherUser;

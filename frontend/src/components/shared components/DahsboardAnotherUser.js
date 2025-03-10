import React, { useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../App";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Row, Form, Spinner, Modal } from "react-bootstrap";

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
  const [editPostContent, setEditPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios
      .get(`https://connectifyy-j4fb.onrender.com/users/${id}`)
      .then((response) => {
        setUser(response.data.user);
        setIsFollowed(
          response.data.user.followers.some(
            (follower) => follower._id === userId
          )
        );
        return axios.get(
          `https://connectifyy-j4fb.onrender.com/posts/user/${id}`
        );
      })
      .then((response) => {
        setPosts(response.data.post);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, userId, posts, comment]);
  const handleUpdateComment = (commenId, postId) => {
    axios
      .put(
        `https://connectifyy-j4fb.onrender.com/comments/update/${commenId}`,
        {
          comment: newComment,
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdatePost = (postId) => {
    axios
      .put(`https://connectifyy-j4fb.onrender.com/posts/${postId}/update`, {
        content: editPostContent,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNavigate = (userId) => {
    navigate(`/dashboard/${userId}`);
  };
  const handleDeleteComment = (commentId, postId) => {
    axios
      .delete(`https://connectifyy-j4fb.onrender.com/comments/${commentId}`)
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
        "https://connectifyy-j4fb.onrender.com/users/follow",
        { followedUser: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsFollowed(true);
        axios
          .get(`https://connectifyy-j4fb.onrender.com/users/${id}`)
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
        "https://connectifyy-j4fb.onrender.com/users/unfollow",
        { followedUser: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsFollowed(false);
        axios
          .get(`https://connectifyy-j4fb.onrender.com/users/${id}`)
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
      .delete(
        `https://connectifyy-j4fb.onrender.com/posts/deletePost/${postId}`
      )
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
      .post(
        `https://connectifyy-j4fb.onrender.com/comments/${postId}/addComment`,
        {
          postId,
          commenter: userId,
          comment,
        }
      )
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
      .post(`https://connectifyy-j4fb.onrender.com/likes/${postId}/newLike`, {
        postId,
        userId,
      })
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
      .delete(
        `https://connectifyy-j4fb.onrender.com/likes/deleteLike/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { postId, userId },
        }
      )
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
                        {post.author._id === userId && (
                          <>
                            <div
                              className="d-flex align-items-center mb-3"
                              style={{
                                marginLeft: "auto",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <>
                                <Button
                                  variant="primary"
                                  className="btn btn-warning btn-sm"
                                  style={{
                                    marginRight: "10px",
                                    fontSize: "1rem",
                                  }}
                                  onClick={handleShow}
                                >
                                  edit post
                                </Button>
                                <Modal show={show} onHide={handleClose}>
                                  <Modal.Header closeButton>
                                    <Modal.Title>Edit Post</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body>
                                    Edit Your Post
                                    <input
                                      onChange={(e) =>
                                        setEditPostContent(e.target.value)
                                      }
                                      placeholder="Edit your post"
                                      value={editPostContent}
                                      style={{
                                        padding: "8px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        width: "80%",
                                        fontSize: "1rem",
                                        boxShadow:
                                          "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        marginTop: "5px",
                                      }}
                                    />
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="secondary"
                                      onClick={handleClose}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        handleClose();
                                        handleUpdatePost(post._id);
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </>
                            </div>
                          </>
                        )}
                        {post.author._id === userId && (
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDeletePost(post._id);
                            }}
                          >
                            Delete Post
                          </Button>
                        )}
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
                                {comment?.commenter._id === userId && (
                                  <div
                                    className="comment-edit-section"
                                    style={{ marginTop: "10px" }}
                                  >
                                    <>
                                      <Button
                                        variant="primary"
                                        onClick={handleShow}
                                      >
                                        Edit Comment
                                      </Button>
                                      <Modal show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                          <Modal.Title>
                                            Modal heading
                                          </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                          Edit your Comment
                                          <input
                                            onChange={(e) =>
                                              setNewComment(e.target.value)
                                            }
                                            value={newComment}
                                            placeholder="Edit your comment"
                                            style={{
                                              padding: "8px",
                                              borderRadius: "8px",
                                              border: "1px solid #ddd",
                                              width: "80%",
                                              fontSize: "1rem",
                                              marginTop: "5px",
                                            }}
                                          />
                                        </Modal.Body>

                                        <Modal.Footer>
                                          <Button
                                            variant="secondary"
                                            onClick={() => {
                                              handleClose();
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            variant="primary"
                                            onClick={() => {
                                              handleClose();
                                              handleUpdateComment(comment._id);
                                            }}
                                          >
                                            Save Changes
                                          </Button>
                                        </Modal.Footer>
                                      </Modal>
                                    </>
                                  </div>
                                )}
                                {comment?.commenter._id === userId && (
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
                                )}
                              </>
                            ))
                          ) : (
                            <small>No comments</small>
                          )}
                          <small>{post.likes?.length} Likes</small>
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

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import { Button, Card, Col, Row, Form, Spinner } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TimeLine = () => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [commenter, setCommenter] = useState(userId);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        setPosts(result.data.posts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching posts:", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddPost = () => {
    axios
      .post(
        "http://localhost:5000/posts/create",
        {
          content: newPostContent,
          author: userId,
          images: newPostImage ? [newPostImage] : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setPosts((prevPosts) => [response.data.post, ...prevPosts]);
        setNewPostContent("");
        setNewPostImage("");
      })
      .catch((err) => {
        console.log("Error creating post:", err);
      });
  };

  const handleCloudinaryUpload = () => {
    window.cloudinary.openUploadWidget(
      {
        cloudName: "dz8ocq0ki",
        uploadPreset: "ml_default",
        sources: ["local", "url", "camera"],
        showAdvancedOptions: true,
        cropping: true,
        multiple: false,
        defaultSource: "local",
      },
      (error, result) => {
        if (result && result.event === "success") {
          setNewPostImage(result.info.secure_url);
          console.log("Image uploaded:", result.info.secure_url);
        }
      }
    );
  };

  const handleAddComment = (postId) => {
    axios
      .post(`http://localhost:5000/comments/${postId}/addComment`, {
        postId,
        commenter,
        comment,
      })
      .then((result) => {
        console.log("Comment added:", result);
        setComment("");
      })
      .catch((err) => {
        console.log("Error adding comment:", err);
      });
  };

  const handleFollowUser = (followedUserId) => {
    axios
      .post(
        "http://localhost:5000/users/follow",
        { followedUser: followedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUnfollowUser = (followedUserId) => {
    axios
      .post(
        "http://localhost:5000/users/unfollow",
        { followedUser: followedUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error);
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
        console.log("Liked successfully:", response.data);
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
        console.log("Unliked successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error unliking post:", error);
      });
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">TimeLine</h2>

      <Form className="mb-4 border p-4 rounded shadow-sm bg-light">
        <h5 className="mb-3">Create a New Post</h5>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            style={{
              borderRadius: "8px",
              padding: "10px",
              fontSize: "1.1rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Form.Group>

        
        {newPostImage && (
          <div className="mb-3">
            <img
              src={newPostImage}
              alt="Selected Preview"
              style={{
                width: "100px", 
                height: "auto", 
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="primary"
            onClick={handleAddPost}
            disabled={!newPostContent}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Post
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloudinaryUpload}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            Upload Image
          </Button>
        </div>
      </Form>

      <Row>
        {posts.length > 0 ? (
          posts.map((post, index) => (
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
                    {post.author._id !== userId && (
                      <div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleFollowUser(post.author._id)}
                        >
                          Follow
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleUnfollowUser(post.author._id)}
                        >
                          Unfollow
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="card-text">{post.content}</p>

                  <div className="post-images mb-3">
                    {post.images && post.images.length > 0 ? (
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
                          <p key={index}>
                            <strong
                              style={{ cursor: "pointer", color: "#007bff" }}
                              onClick={() => {
                                navigate(`/dashboard/${comment.commenter._id}`);
                              }}
                            >
                              {comment.commenter.userName}
                            </strong>
                            <br />
                            {comment.comment}
                          </p>
                        ))
                      ) : (
                        <small>No comments</small>
                      )}
                    </small>
                    <small>{post.likes.length} Likes</small>
                  </div>
                  <div className="mt-2">
                    <input
                      className="form-control form-control-sm"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2 w-100"
                      onClick={() => handleAddComment(post._id)}
                    >
                      Add comment
                    </Button>

                    <button
                      className={`btn ${
                        post.likes.some((like) => like.userId === userId)
                          ? "btn-danger"
                          : "btn-light"
                      } btn-sm`}
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
          ))
        ) : (
          <p className="text-center">No posts available</p>
        )}
      </Row>
    </div>
  );
};

export default TimeLine;

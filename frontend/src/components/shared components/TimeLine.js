import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../App";
import { jwtDecode } from "jwt-decode";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TimeLine = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [comment, setComment] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [commenter, setCommenter] = useState(userId);

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
        console.log("Error Creating Post : ", err);
      });
  };

  const handleAddComment = (postId) => {
    console.log("postid", postId);
    axios
      .post(`http://localhost:5000/comments/${postId}/addComment`, {
        postId,
        commenter,
        comment,
      })
      .then((result) => {
        console.log("postId", result);
        setCommenter(userId);
      })
      .catch((err) => {
        console.log("postId", postId);
        console.log(err);
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">TimeLine</h2>
  
      
      <Form className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Image URL (optional)"
            value={newPostImage}
            onChange={(e) => setNewPostImage(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleAddPost}
          disabled={!newPostContent}
        >
          Post
        </Button>
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
                      <small>No images</small>
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
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
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

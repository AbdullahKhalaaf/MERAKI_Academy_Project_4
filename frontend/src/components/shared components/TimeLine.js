import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TimeLine = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
                    <h5 className="ms-3 mb-0">{post.author.userName}</h5>
                  </div>
                  <p className="card-text">{post.content}</p>
                </div>

                <div className="card-footer text-muted mt-2">
                  <small>
                    {post.comments.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <p>
                          <strong>{comment.commenter.userName}</strong>
                          <br></br>
                          {comment.comment}
                        </p>
                      ))
                    ) : (
                      <small>No comments</small>
                    )}
                  </small>
                </div>
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

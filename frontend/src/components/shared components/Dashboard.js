import React, { useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../App";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css"; 

const Dashboard = () => {
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

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
                  <li key={follower._id} className="list-group-item d-flex align-items-center">
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
                  <li key={following._id} className="list-group-item d-flex align-items-center">
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

          <h3 className="mt-4">Posts by {user.userName}</h3>
          <div className="list-group">
            {posts?.map((post) => (
              <div key={post._id} className="list-group-item mb-3">
                <p>{post.content}</p>
                <div>
                  <span className="badge bg-primary">{post.likes?.length} Likes</span>
                </div>
              </div>
            )) || <p>No posts available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../../App";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Button } from "react-bootstrap";

const DashboardAnotherUser = () => {
  const { token } = useContext(userContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((response) => {
        setUser(response.data.user);
        
        setIsFollowed(response.data.user.followers.some(follower => follower._id === userId));
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

  const handleFollowUser = () => {
    axios
      .post("http://localhost:5000/users/follow", { followedUser: id }, { headers: { Authorization: `Bearer ${token}` } })
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
      .post("http://localhost:5000/users/unfollow", { followedUser: id }, { headers: { Authorization: `Bearer ${token}` } })
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
              style={{ width: "150px", cursor: "pointer" }}
              onClick={() => handleNavigate(user._id)}
            />
          </div>
          <h3
            className="text-center"
            onClick={() => handleNavigate(user._id)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {user.userName}
          </h3>

          
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
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavigate(follower._id)}
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
                    style={{ cursor: "pointer" }}
                    onClick={() => handleNavigate(following._id)}
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

export default DashboardAnotherUser;

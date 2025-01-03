import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((response) => {
        setUser(response.data.user);

        return axios.get(`http://localhost:5000/posts/user/${id}`);
      })
      .then((response) => {
        setUserPosts(response.data.post);
        console.log("userPosts", response.data.post);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data or posts:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && (
        <div>
          <h2>{user.userName}'s Profile</h2>
          <img
            src={user.avatar}
            alt={`${user.userName}'s avatar`}
            style={{ width: "150px", borderRadius: "50%" }}
          />
          <h2>{user.userName}</h2>
          <h3>Followers:</h3>
          <ul>
            {user.followers.map((follower) => (
              <li key={follower._id}>
                <img
                  src={follower.avatar}
                  alt={`${follower.userName}'s avatar`}
                  style={{ width: "50px", borderRadius: "50%" }}
                />
                {follower.userName}
              </li>
            ))}
          </ul>
          <h3>Following:</h3>
          <ul>
            {user.following.map((following) => (
              <li key={following._id}>
                <img
                  src={following.avatar}
                  alt={`${following.userName}'s avatar`}
                  style={{ width: "50px", borderRadius: "50%" }}
                />
                {following.userName}
              </li>
            ))}
          </ul>

          <h3>Posts by {user.userName}</h3>
          {userPosts ? (
            userPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                }}
              >
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                <div>
                  <span>{post.likes?.length} Likes</span>
                </div>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
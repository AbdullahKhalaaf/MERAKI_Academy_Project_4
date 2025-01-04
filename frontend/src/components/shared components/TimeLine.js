import React from "react";
import axios from "axios";
import { userContext } from "../../App";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const TimeLine = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((result) => {
        console.log("result", result);

        setPosts();
        console.log("posts:", posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <div>TimeLine</div>;
};

export default TimeLine;

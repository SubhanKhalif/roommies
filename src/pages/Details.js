import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, CircularProgress, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { SetSelectedUserId } from "../services/Actions/Chat/action.js";

const getImageUrl = (pic) => {
  if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  if (pic.startsWith("http")) return pic;
  return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
};

export const Details = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post");
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChat = () => {
    if (post?.user?._id) {
      dispatch(SetSelectedUserId(post.user._id));
      navigate("/home/message");
    }
  };

  if (loading) return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  if (!post) return <div className="text-center text-red-500 mt-10">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Post Images */}
      <div className="mb-6">
        {post.images && post.images.length > 0 ? (
          <img src={getImageUrl(post.images[0])} alt="Post" className="w-full h-64 object-cover rounded-md" />
        ) : (
          <p className="text-gray-500">No images available</p>
        )}
      </div>

      {/* Post Details */}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.description}</p>

      {/* User Info */}
      <div className="flex items-center mt-6">
        <Avatar src={getImageUrl(post.user.pic)} sx={{ width: 60, height: 60 }} />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{post.user.name}</h2>
          <p className="text-gray-500">{post.user.email}</p>
        </div>
      </div>

      {/* Chat Button */}
      <div className="mt-6 flex justify-center">
        <Button variant="contained" color="primary" onClick={handleChat} sx={{ fontSize: "1rem", padding: "10px 20px" }}>
          Chat with {post.user.name}
        </Button>
      </div>
    </div>
  );
};

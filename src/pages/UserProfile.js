import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, CircularProgress, Button } from "@mui/material";
import { useDispatch } from 'react-redux';
import { SetSelectedUserId } from '../services/Actions/Chat/action.js';

const getImageUrl = (pic) => {
  if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  if (pic.startsWith("http")) return pic;
  return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
};

export const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const idToFetch = userId || JSON.parse(localStorage.getItem("user"))._id;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${idToFetch}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChat = () => {
    if (user?._id) {
      dispatch(SetSelectedUserId(user._id));
      navigate('/home/message');
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-10"><CircularProgress /></div>;
  }

  if (!user) {
    return <div className="text-center text-red-500 mt-10">User not found</div>;
  }

  return (
    <div className='w-[80vw] relative flex flex-col h-screen overflow-hidden'>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center">
          <Avatar
            src={getImageUrl(user.pic)}
            sx={{ width: 100, height: 100 }}
          />
          <div className="ml-6">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {user.bio || "No bio available"}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Location</h2>
          <p className="text-gray-700 text-lg">
            {user.location || "Not specified"}
          </p>
        </div>

        {/* Chat Button */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleChat}
            sx={{ fontSize: "1rem", padding: "10px 20px" }}
          >
            Chat with {user.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserInfo = ({ user, createdAt }) => {
  const navigate = useNavigate();

  const profilePicture = user?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const name = user?.name || "Unknown User";

  const handleUserClick = () => {
    if (user?._id) navigate(`/home/${user._id}`);
  };

  const getImageUrl = (pic) => {
    if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    if (pic.startsWith("http")) return pic;
    return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years}y`;
    if (months > 0) return `${months}mo`;
    if (weeks > 0) return `${weeks}w`;
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "Just now";
  };

  return (
    <div className="flex items-center">
      <Avatar
        referrerPolicy="no-referrer"
        alt="User Profile"
        sx={{ width: 40, height: 40 }}
        src={getImageUrl(profilePicture)}
        className="cursor-pointer"
        onClick={handleUserClick}
      />
      <div className="ml-3">
        <h3
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleUserClick}
        >
          {name}
        </h3>
        <p
          className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={handleUserClick}
        >
          {formatTime(createdAt)}
        </p>
      </div>
    </div>
  );
};

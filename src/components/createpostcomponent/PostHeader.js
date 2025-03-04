import { Avatar } from "@mui/material";

const getImageUrl = (pic) => {
  if (!pic) return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  if (pic.startsWith("http")) return pic;
  return `${process.env.REACT_APP_API_URL}/img/user/${pic}`;
};

export default function PostHeader({ user }) {
  return (
    <div className="flex items-center space-x-3">
      <Avatar src={getImageUrl(user?.pic)} />
      <div>
        <p className="font-semibold">{user?.name}</p>
        <select className="text-sm text-gray-500">
          <option>Post to Anyone</option>
          <option>Connections Only</option>
        </select>
      </div>
    </div>
  );
}

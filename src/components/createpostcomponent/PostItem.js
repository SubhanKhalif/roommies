import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import { UserInfo } from "../LandingPageComponents/UserInfo.js";

export default function PostItem({ post, onEdit, fetchUserPosts }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/posts/${post._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }

      fetchUserPosts();
    } catch (error) {
      setError(error.message);
      console.error("Error deleting post:", error);
    }
    handleMenuClose();
  };

  const renderMedia = () => {
    if (!post.media) return null;

    const mediaUrl = post.media.startsWith("http") 
      ? post.media 
      : `${process.env.REACT_APP_API_URL}/api/v1/posts/${post.media}`;

    const fileExtension = mediaUrl.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);

    return (
      <div className="w-full aspect-square overflow-hidden rounded-lg mb-4">
        {isImage ? (
          <img
            src={mediaUrl}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        ) : isVideo ? (
          <video controls className="w-full h-full">
            <source src={mediaUrl} type={`video/${fileExtension}`} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </div>
    );
  };

  return (
    <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        
        {/* Post Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <UserInfo user={post.user} createdAt={post.createdAt} />
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => { handleMenuClose(); onEdit(post); }}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>

        {/* Media Rendering */}
        {renderMedia()}

        {/* Post Details */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>{post.title}</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>{post.description}</Typography>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>📍 {post.location}</span>
          <span>💰 ₹ {post.rent}/month</span>
        </div>
      </CardContent>
    </Card>
  );
}

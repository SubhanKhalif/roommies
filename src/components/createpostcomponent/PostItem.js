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

  return (
    <Card className="p-4">
      <CardContent>
        {error && <Typography color="error" className="mb-2">{error}</Typography>}
        <div className="flex justify-between items-center">
          <UserInfo user={post.user} createdAt={post.createdAt} />
          <Box display="flex" alignItems="center">
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={() => {
              handleMenuClose();
              onEdit(post);
            }}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </div>

        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body2">{post.description}</Typography>
        <Typography variant="body2">{post.location}</Typography>
        <Typography variant="body2">Rent: ₹ {post.rent}</Typography>
      </CardContent>
    </Card>
  );
}
